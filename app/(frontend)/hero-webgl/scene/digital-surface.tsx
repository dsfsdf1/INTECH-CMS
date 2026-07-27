"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  SURFACE_COLORS,
  SURFACE_MOTION,
  type SurfaceQuality,
} from "./config";
import {
  pointsFragmentShader,
  pointsVertexShader,
  surfaceFragmentShader,
  surfaceVertexShader,
} from "./shaders";

type PointerPosition = { x: number; y: number };

type DigitalSurfaceProps = {
  active: boolean;
  fullBleed?: boolean;
  pointerRef: MutableRefObject<PointerPosition>;
  progressRef: MutableRefObject<number>;
  quality: SurfaceQuality;
  reducedMotion: boolean;
};

export function DigitalSurface({
  active,
  fullBleed = false,
  pointerRef,
  progressRef,
  quality,
  reducedMotion,
}: DigitalSurfaceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const surfaceMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const smoothPointer = useRef(new THREE.Vector2());
  const { gl } = useThree();
  const compact = quality.key === "compact";
  const basePosition: [number, number, number] = fullBleed
    ? [0.04, compact ? -0.08 : -0.08, 0]
    : quality.position;
  const baseScale =
    quality.scale *
    (fullBleed
      ? quality.key === "expanded"
        ? 1.34
        : quality.key === "medium"
          ? 1.2
          : 1.23
      : 1);
  const coverageScaleY =
    fullBleed && compact ? 1.32 : 1;
  const baseRotation: [number, number, number] = compact
    ? fullBleed
      ? [-0.1, 0.14, -0.04]
      : [-0.24, -0.46, -0.08]
    : [-0.15, -0.28, -0.09];

  const geometry = useMemo(
    () =>
      new THREE.PlaneGeometry(
        9.6,
        7.2,
        quality.segments[0],
        quality.segments[1],
      ),
    [quality],
  );

  const surfaceUniforms = useMemo(
    () => ({
      uTime: { value: 2.8 },
      uScroll: { value: 0 },
      uReducedMotion: { value: reducedMotion ? 1 : 0 },
      uFullBleed: { value: fullBleed ? 1 : 0 },
      uPointer: { value: new THREE.Vector2() },
      uPointerRadius: { value: SURFACE_MOTION.pointerRadius },
      uPointerStrength: {
        value: compact ? 0 : SURFACE_MOTION.pointerStrength,
      },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), quality.maxDpr) },
      uPointScale: { value: quality.pointScale },
      uBlue: { value: new THREE.Color(SURFACE_COLORS.blue) },
      uBlueMid: { value: new THREE.Color(SURFACE_COLORS.blueMid) },
      uBlueDeep: { value: new THREE.Color(SURFACE_COLORS.blueDeep) },
      uAccent: { value: new THREE.Color(SURFACE_COLORS.accent) },
    }),
    [compact, fullBleed, gl, quality, reducedMotion],
  );
  const pointsUniforms = useMemo(
    () => ({
      uTime: { value: 2.8 },
      uScroll: { value: 0 },
      uReducedMotion: { value: reducedMotion ? 1 : 0 },
      uFullBleed: { value: fullBleed ? 1 : 0 },
      uPointer: { value: new THREE.Vector2() },
      uPointerRadius: { value: SURFACE_MOTION.pointerRadius },
      uPointerStrength: {
        value: compact ? 0 : SURFACE_MOTION.pointerStrength,
      },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), quality.maxDpr) },
      uPointScale: { value: quality.pointScale },
      uBlue: { value: new THREE.Color(SURFACE_COLORS.blue) },
      uBlueMid: { value: new THREE.Color(SURFACE_COLORS.blueMid) },
      uBlueDeep: { value: new THREE.Color(SURFACE_COLORS.blueDeep) },
      uAccent: { value: new THREE.Color(SURFACE_COLORS.accent) },
    }),
    [compact, fullBleed, gl, quality, reducedMotion],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    if (!active && !reducedMotion) return;

    const progress = reducedMotion ? 0.12 : progressRef.current;
    const pointerTarget =
      reducedMotion || compact ? { x: 0, y: 0 } : pointerRef.current;
    const damping = 1 - Math.exp(-delta * (compact ? 6.5 : 12));

    smoothPointer.current.x = THREE.MathUtils.lerp(
      smoothPointer.current.x,
      pointerTarget.x,
      damping,
    );
    smoothPointer.current.y = THREE.MathUtils.lerp(
      smoothPointer.current.y,
      pointerTarget.y,
      damping,
    );

    const materials = [
      surfaceMaterialRef.current,
      pointsMaterialRef.current,
    ];

    materials.forEach((material) => {
      if (!material) return;
      material.uniforms.uTime.value = reducedMotion
        ? 2.8
        : clock.elapsedTime * SURFACE_MOTION.timeScale;
      material.uniforms.uScroll.value = progress;
      material.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
      material.uniforms.uPointer.value.copy(smoothPointer.current);
      material.uniforms.uPixelRatio.value = Math.min(
        gl.getPixelRatio(),
        quality.maxDpr,
      );
    });

    if (!groupRef.current) return;

    const lateProgress = THREE.MathUtils.smoothstep(progress, 0.68, 1);
    const scaleY = 1 + THREE.MathUtils.smoothstep(progress, 0.24, 0.86) * 0.07;
    const compactDrift = reducedMotion
      ? 0
      : Math.sin(clock.elapsedTime * 0.26) * 0.055;
    const targetX =
      basePosition[0] +
      lateProgress * SURFACE_MOTION.scrollShiftX * (compact ? 0.34 : 1) +
      (compact ? compactDrift : 0);
    const targetY =
      basePosition[1] +
      lateProgress * SURFACE_MOTION.scrollShiftY * (compact ? 0.42 : 1) +
      (compact
        ? Math.cos(clock.elapsedTime * 0.22) * (reducedMotion ? 0 : 0.045)
        : 0);
    const targetRotationX =
      baseRotation[0] -
      smoothPointer.current.y * SURFACE_MOTION.maxTiltRadians +
      (compact ? lateProgress * -0.045 : 0);
    const targetRotationY =
      baseRotation[1] +
      smoothPointer.current.x * SURFACE_MOTION.maxTiltRadians +
      (compact ? compactDrift * 0.5 : 0);

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      damping,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      damping,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      damping,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      damping,
    );
    groupRef.current.scale.set(
      baseScale * quality.shapeScale[0],
      baseScale * quality.shapeScale[1] * coverageScaleY * scaleY,
      baseScale,
    );
  });

  return (
    <group
      ref={groupRef}
      position={basePosition}
      rotation={baseRotation}
      scale={[
        baseScale * quality.shapeScale[0],
        baseScale * quality.shapeScale[1] * coverageScaleY,
        baseScale,
      ]}
    >
      <mesh geometry={geometry} renderOrder={0}>
        <shaderMaterial
          depthWrite={false}
          fragmentShader={surfaceFragmentShader}
          ref={surfaceMaterialRef}
          side={THREE.DoubleSide}
          transparent
          uniforms={surfaceUniforms}
          vertexShader={surfaceVertexShader}
        />
      </mesh>
      <points geometry={geometry} renderOrder={1}>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={pointsFragmentShader}
          ref={pointsMaterialRef}
          transparent
          uniforms={pointsUniforms}
          vertexShader={pointsVertexShader}
        />
      </points>
    </group>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import {
  MutableRefObject,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { selectSurfaceQuality } from "./config";
import { DigitalSurface } from "./digital-surface";
import styles from "../hero-webgl.module.css";

type SurfaceCanvasProps = {
  fullBleed?: boolean;
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext &&
        canvas.getContext("webgl2", {
          failIfMajorPerformanceCaveat: true,
        }),
    );
  } catch {
    return false;
  }
}

export function SurfaceCanvas({
  fullBleed = false,
  progressRef,
  reducedMotion,
}: SurfaceCanvasProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [quality, setQuality] = useState(() => selectSurfaceQuality(1440));

  useEffect(() => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 8;

    const updateQuality = () => {
      setQuality(
        selectSurfaceQuality(window.innerWidth, hardwareConcurrency),
      );
    };

    const setupFrame = window.requestAnimationFrame(() => {
      setSupported(supportsWebGL());
      updateQuality();
    });
    window.addEventListener("resize", updateQuality, { passive: true });

    return () => {
      window.cancelAnimationFrame(setupFrame);
      window.removeEventListener("resize", updateQuality);
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "25% 0px 25% 0px" },
    );

    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || quality.key === "compact") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerRef.current.y =
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  }

  function resetPointer() {
    pointerRef.current = { x: 0, y: 0 };
  }

  const showCanvas = supported === true;

  return (
    <div
      className={styles.canvasShell}
      onPointerLeave={resetPointer}
      onPointerMove={updatePointer}
      ref={shellRef}
    >
      <Image
        alt=""
        aria-hidden="true"
        className={
          showCanvas && canvasReady
            ? `${styles.fallback} ${styles.fallbackHidden}`
            : styles.fallback
        }
        fill
        priority
        sizes="100vw"
        src="/intech/hero-webgl/fallback.png"
        unoptimized
      />
      {showCanvas ? (
        <Canvas
          camera={{ fov: 47, near: 0.1, far: 40, position: [0, 0, 7.8] }}
          className={styles.canvas}
          dpr={[1, quality.maxDpr]}
          frameloop={active && !reducedMotion ? "always" : "demand"}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference:
              quality.key === "compact" ? "low-power" : "high-performance",
          }}
          key={quality.key}
          onCreated={({ gl }) => {
            gl.domElement.setAttribute("aria-hidden", "true");
            gl.domElement.setAttribute("role", "presentation");
            setCanvasReady(true);
          }}
        >
          <DigitalSurface
            active={active}
            fullBleed={fullBleed}
            pointerRef={pointerRef}
            progressRef={progressRef}
            quality={quality}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      ) : null}
    </div>
  );
}

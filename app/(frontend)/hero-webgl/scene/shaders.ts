const deformation = /* glsl */ `
  float bell(float value, float width) {
    return exp(-value * value * width);
  }

  float hash21(vec2 value) {
    return fract(sin(dot(value, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec3 deformSurface(vec3 source) {
    vec3 p = source;
    float energy = smoothstep(0.12, 0.9, uScroll);
    float idleEnergy = (1.0 - uReducedMotion) * 0.56;
    float waveEnergy = min(1.0, idleEnergy + energy * 0.62);
    float late = smoothstep(0.68, 1.0, uScroll);
    float idle = uReducedMotion > 0.5 ? 0.0 : uTime;

    vec2 grain = vec2(
      hash21(source.xy),
      hash21(source.yx + vec2(12.7, 4.3))
    ) - 0.5;
    p.xy += grain * 0.052;

    float domainA = sin(
      p.x * 0.53 +
      sin(p.y * 0.79 + idle * 0.5) * 1.38 -
      idle * 0.4
    );
    float domainB = cos(
      p.y * 0.67 -
      cos(p.x * 0.47 - idle * 0.43) * 1.18 +
      idle * 0.46
    );

    float mainRidge = sin(
      p.y * 1.12 +
      domainA * 1.28 +
      p.x * 0.2 -
      idle * 0.58
    );
    float crossFold = cos(
      p.x * 0.86 -
      p.y * 0.44 +
      domainB * 0.88 +
      idle * 0.48
    );
    float tensionLine = bell(
      p.y - sin(p.x * 0.64 - idle * 0.4) * 1.2,
      0.68
    );
    float secondaryLine = bell(
      p.y + 1.42 - cos(p.x * 0.51 + idle * 0.36) * 0.8,
      0.9
    );
    float microFold = sin(
      p.x * 2.12 +
      p.y * 1.66 +
      domainA * 0.7 +
      idle * 0.78
    );
    float foldCrest = bell(
      p.y - sin(p.x * 0.74 - idle * 0.46) * 1.36 - 0.1,
      1.35
    );
    float foldValley = bell(
      p.y + 0.88 - cos(p.x * 0.6 + idle * 0.38) * 1.02,
      1.25
    );
    float innerCurrent = sin(
      p.x * 0.67 +
      p.y * 0.92 +
      domainB * 0.86 -
      idle * 0.7
    );
    float depthBreath = cos(
      p.x * 0.34 -
      p.y * 0.56 +
      domainA * 0.62 +
      idle * 0.52
    );

    float rightEnvelope = smoothstep(-4.7, -0.9, p.x);
    float edgeEnvelope = 0.72 + 0.28 * smoothstep(-3.4, 2.4, p.x);

    p.y += sin(p.x * 0.48 + domainB * 0.56 + idle * 0.18) *
      0.34 * rightEnvelope;
    p.x += sin(p.y * 0.39 + domainA * 0.35 - idle * 0.15) *
      0.2 * rightEnvelope;

    p.z += (
      mainRidge * 0.82 +
      crossFold * 0.53 +
      tensionLine * 1.16 -
      secondaryLine * 0.72 +
      microFold * 0.19 +
      foldCrest * 1.18 -
      foldValley * 0.82 +
      innerCurrent * idleEnergy * 0.38 +
      depthBreath * idleEnergy * 0.24
    ) * edgeEnvelope;
    p.y += foldCrest *
      sin(p.x * 0.58 + idle * 0.2) *
      0.22 *
      rightEnvelope;

    float scrollWaveA = sin(
      p.x * 1.08 -
      p.y * 0.3 -
      uScroll * 8.4 +
      idle * 0.24
    );
    float scrollWaveB = cos(
      p.y * 1.42 +
      p.x * 0.35 +
      uScroll * 6.2 -
      idle * 0.22
    );
    float movingFold = bell(
      p.y - sin(p.x * 0.82 - uScroll * 3.8 + idle * 0.18) * 1.34,
      0.5
    );
    float trailingFold = bell(
      p.y + 1.1 - cos(p.x * 0.58 + uScroll * 3.1) * 0.72,
      0.74
    );

    p.z += waveEnergy * (
      scrollWaveA * 0.72 +
      scrollWaveB * 0.42 +
      movingFold * 1.0 -
      trailingFold * 0.42
    ) * edgeEnvelope;
    p.y += waveEnergy * sin(p.x * 0.78 - uScroll * 5.1 + idle * 0.15) *
      0.62 * rightEnvelope;
    p.x += waveEnergy * sin(p.y * 0.64 + uScroll * 4.0 - idle * 0.12) *
      0.37 * rightEnvelope;
    p.z += late * sin(p.x * 1.54 + p.y * 0.48 - uScroll * 8.0) * 0.24;

    vec2 pointerPosition = vec2(
      uPointer.x * 4.2,
      uPointer.y * 3.05
    );
    float pointerDistance = distance(p.xy, pointerPosition);
    float pointerInfluence = exp(
      -pointerDistance * pointerDistance /
      max(0.1, uPointerRadius * uPointerRadius)
    ) * uPointerStrength * (1.0 - uReducedMotion);

    p.z += pointerInfluence * 1.02;
    p.xy += normalize(p.xy - pointerPosition + vec2(0.001)) *
      pointerInfluence * 0.18;

    float mainCrest = smoothstep(0.18, 0.96, mainRidge);
    float crossCrest = smoothstep(0.34, 0.98, crossFold);
    float scrollCrest = smoothstep(0.2, 0.96, scrollWaveA);
    vShape = clamp(
      mainCrest * 0.46 +
      crossCrest * 0.24 +
      tensionLine * 0.58 +
      foldCrest * 0.64 +
      movingFold * waveEnergy * 0.46 +
      scrollCrest * waveEnergy * 0.3 +
      pointerInfluence * 0.68,
      0.0,
      1.0
    );
    vDepth = clamp((p.z + 2.1) / 4.2, 0.0, 1.0);
    vPointer = pointerInfluence;
    float densityField = (
      0.5 + 0.5 * sin(
        source.x * 0.76 +
        domainB * 1.34 -
        idle * 0.16
      )
    ) * (
      0.5 + 0.5 * cos(
        source.y * 0.91 -
        domainA * 1.08 +
        idle * 0.13
      )
    );
    float densityCrest = smoothstep(0.26, 0.92, vShape);
    float densityCurrent = 0.5 + 0.5 * sin(
      source.x * 0.29 -
      source.y * 0.54 +
      innerCurrent * 0.76
    );
    vDensity = clamp(
      0.025 +
      densityField * 0.27 +
      densityCurrent * 0.13 +
      densityCrest * 0.7 +
      vDepth * 0.08 +
      uFullBleed * (0.18 + densityCrest * 0.08),
      0.0,
      1.0
    );

    return p;
  }
`;

export const surfaceVertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform float uReducedMotion;
  uniform float uFullBleed;
  uniform float uPointerRadius;
  uniform float uPointerStrength;
  uniform vec2 uPointer;

  varying float vShape;
  varying float vDepth;
  varying float vPointer;
  varying float vDensity;

  ${deformation}

  void main() {
    vec3 transformed = deformSurface(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

export const surfaceFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uBlueDeep;
  uniform vec3 uBlueMid;
  varying float vShape;
  varying float vDepth;
  varying float vPointer;
  varying float vDensity;

  void main() {
    float surfaceSignal = clamp(
      vShape * 0.56 +
      vDensity * 0.27 +
      vDepth * 0.17,
      0.0,
      1.0
    );
    float opacity = (
      0.025 +
      vShape * 0.085 +
      vDensity * 0.035 +
      vPointer * 0.055
    ) * mix(0.28, 0.88, vDensity);
    vec3 color = mix(
      uBlueDeep * 0.24,
      uBlueMid * 0.42,
      smoothstep(0.12, 0.9, surfaceSignal)
    );
    gl_FragColor = vec4(color, opacity);
  }
`;

export const pointsVertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform float uReducedMotion;
  uniform float uFullBleed;
  uniform float uPointerRadius;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  uniform float uPointScale;
  uniform vec2 uPointer;

  varying float vShape;
  varying float vDepth;
  varying float vPointer;
  varying float vDensity;
  varying float vVisibility;
  varying float vHighlight;
  varying float vNetwork;
  varying float vPulse;

  ${deformation}

  void main() {
    vec3 transformed = deformSurface(position);
    vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
    float randomValue = hash21(position.xy * 1.37 + vec2(5.1, 9.7));
    vVisibility = smoothstep(
      mix(0.27, 0.2, uFullBleed),
      mix(0.7, 0.62, uFullBleed),
      vDensity + randomValue * 0.46
    );
    float ridgeLight = smoothstep(
      0.34,
      0.94,
      vShape + vDepth * 0.2
    );
    vPulse = 0.5 + 0.5 * sin(
      position.x * 1.58 -
      position.y * 1.12 -
      uScroll * 14.0 +
      uTime * 0.38
    );
    float networkFlow = 0.5 + 0.5 * sin(
      position.x * 0.82 -
      position.y * 0.48 +
      vShape * 1.4 -
      uTime * 0.14
    );
    vNetwork = clamp(
      ridgeLight * 0.52 +
      vDensity * 0.34 +
      networkFlow * 0.14 +
      vPointer * 0.18,
      0.0,
      1.0
    );
    vHighlight = clamp(
      ridgeLight * 0.58 +
      vDensity * 0.2 +
      vDepth * 0.16 +
      vPulse * 0.06 +
      vPointer * 0.18,
      0.0,
      1.0
    ) * mix(0.88, 1.08, randomValue);

    float depthScale = clamp(7.6 / max(4.3, -viewPosition.z), 0.66, 1.52);
    float size = (
      1.68 +
      vShape * 1.72 +
      vNetwork * 0.82 +
      vHighlight * 0.48 +
      vPointer * 0.52
    ) *
      uPointScale *
      uPixelRatio *
      depthScale *
      mix(0.68, 1.12, vVisibility) *
      mix(0.94, 1.14, vDepth);

    gl_PointSize = clamp(size, 1.48, 6.7 * uPixelRatio);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

export const pointsFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uBlue;
  uniform vec3 uBlueMid;
  uniform vec3 uBlueDeep;
  uniform vec3 uAccent;
  varying float vShape;
  varying float vDepth;
  varying float vPointer;
  varying float vDensity;
  varying float vVisibility;
  varying float vHighlight;
  varying float vNetwork;
  varying float vPulse;

  void main() {
    if (vVisibility < 0.1) discard;

    vec2 centered = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(centered);
    if (distanceFromCenter > 0.5) discard;

    float hotCore = 1.0 - smoothstep(0.035, 0.125, distanceFromCenter);
    float nodeBody = 1.0 - smoothstep(0.09, 0.285, distanceFromCenter);
    float nodeRim = smoothstep(0.1, 0.17, distanceFromCenter) *
      (1.0 - smoothstep(0.19, 0.3, distanceFromCenter));
    float softHalo = 1.0 - smoothstep(0.18, 0.5, distanceFromCenter);

    float rampSignal = clamp(
      vShape * 0.5 +
      vDensity * 0.2 +
      vDepth * 0.16 +
      vNetwork * 0.1 +
      vPulse * 0.04 +
      vPointer * 0.18,
      0.0,
      1.0
    );
    vec3 color = mix(
      uBlueDeep * 0.7,
      uBlueMid,
      smoothstep(0.06, 0.46, rampSignal)
    );
    color = mix(
      color,
      uBlue,
      smoothstep(0.34, 0.76, rampSignal)
    );
    float silverMix = smoothstep(
      0.83,
      0.99,
      rampSignal * 0.78 + vHighlight * 0.22
    );
    color = mix(color, uAccent, silverMix);

    float haloStrength = (
      0.085 +
      vNetwork * 0.3 +
      vPointer * 0.1
    ) * mix(0.58, 1.0, vDepth);
    vec3 haloColor = mix(
      uBlueMid,
      uBlue,
      smoothstep(0.22, 0.78, rampSignal)
    );
    color = mix(
      haloColor,
      color,
      clamp(nodeBody + hotCore * 0.34, 0.0, 1.0)
    );
    color = mix(
      color,
      uAccent,
      hotCore * (0.12 + silverMix * 0.34)
    );
    color += haloColor * softHalo * haloStrength * 0.17;

    float alpha = (
      softHalo * haloStrength +
      nodeRim * (0.12 + vNetwork * 0.12) +
      nodeBody * (0.42 + rampSignal * 0.24) +
      hotCore * (0.34 + vHighlight * 0.24)
    );
    alpha *= mix(0.46, 1.0, vDepth);
    alpha *= mix(0.5, 1.04, vDensity) * vVisibility;

    gl_FragColor = vec4(color, min(alpha, 1.0));
  }
`;

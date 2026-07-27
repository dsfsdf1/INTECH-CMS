export const SURFACE_COLORS = {
  background: "#000104",
  blue: "#0058ff",
  blueMid: "#123b82",
  blueDeep: "#00113a",
  accent: "#b8c7dc",
} as const;

export type SurfaceQuality = {
  key: "compact" | "medium" | "expanded";
  segments: [number, number];
  pointScale: number;
  maxDpr: number;
  scale: number;
  shapeScale: [number, number];
  position: [number, number, number];
};

export const SURFACE_QUALITY: Record<SurfaceQuality["key"], SurfaceQuality> = {
  compact: {
    key: "compact",
    segments: [144, 106],
    pointScale: 0.96,
    maxDpr: 1.25,
    scale: 0.66,
    shapeScale: [0.82, 1.18],
    position: [0.18, -0.66, 0],
  },
  medium: {
    key: "medium",
    segments: [196, 144],
    pointScale: 1.06,
    maxDpr: 1.5,
    scale: 0.94,
    shapeScale: [1, 1],
    position: [1.5, -0.2, 0],
  },
  expanded: {
    key: "expanded",
    segments: [252, 188],
    pointScale: 1.1,
    maxDpr: 1.65,
    scale: 1.08,
    shapeScale: [1, 1],
    position: [2.06, 0.24, 0],
  },
};

export const SURFACE_MOTION = {
  idleCycleSeconds: 10.6,
  timeScale: 0.8,
  pointerRadius: 1.82,
  pointerStrength: 0.82,
  maxTiltRadians: 0.072,
  scrollShiftX: 0.72,
  scrollShiftY: 0.38,
} as const;

export function selectSurfaceQuality(
  viewportWidth: number,
  hardwareConcurrency = 8,
) {
  if (viewportWidth < 700 || hardwareConcurrency <= 4) {
    return SURFACE_QUALITY.compact;
  }

  if (viewportWidth < 1180 || hardwareConcurrency <= 6) {
    return SURFACE_QUALITY.medium;
  }

  return SURFACE_QUALITY.expanded;
}

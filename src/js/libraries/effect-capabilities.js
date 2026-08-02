import { reducedMotion } from "../features/preferences/motion";

export function isGpuCapable() {
  try {
    const canvas = document.createElement("canvas");
    const attrs = {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    };

    const gl =
      canvas.getContext("webgl2", attrs) ||
      canvas.getContext("webgl", attrs) ||
      canvas.getContext("experimental-webgl", attrs);

    if (!gl) return false;

    try {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}

    return true;
  } catch {
    return false;
  }
}

export function detectEffectCapabilities(options = {}) {
  const { recheckOnVisibility = false, respectReducedMotion = true } = options;
  const root = document.documentElement;

  const prefersReducedMotion = () => respectReducedMotion && reducedMotion.value;

  const detect = () => {
    const gpuCapable = isGpuCapable();
    const motionAllowed = !prefersReducedMotion();

    root.classList.toggle("motion", motionAllowed);
    root.classList.toggle("reduced-motion", !motionAllowed);

    return { gpuCapable, motionAllowed };
  };

  const capabilities = detect();

  if (recheckOnVisibility) {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) detect();
    });
  }

  return capabilities;
}

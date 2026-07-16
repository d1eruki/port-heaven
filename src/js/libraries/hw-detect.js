export function isHardwareAccelerationEnabled() {
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

    let renderer = "";
    let vendor = "";
    let hasReliableRendererInfo = false;
    try {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "";
        vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "";
        hasReliableRendererInfo = Boolean(renderer || vendor);
      } else {
        renderer = gl.getParameter(gl.RENDERER) || "";
        vendor = gl.getParameter(gl.VENDOR) || "";
      }
    } catch {}

    const signature = (String(renderer) + " " + String(vendor)).toLowerCase();
    const softwareMarkers = [
      "swiftshader",
      "swift shader",
      "google swiftshader",
      "llvmpipe",
      "llvm",
      "softpipe",
      "software",
      "mesa",
      "angle (swiftshader",
      "angle (mesa",
      "warp",
      "d3d11 warp",
      "microsoft basic render driver",
      "basic render",
      "software adapter",
      "angle (d3d11 warp",
      "angle (microsoft",
    ];
    const looksSoftware = softwareMarkers.some((m) => signature.includes(m));

    try {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}

    return hasReliableRendererInfo && !looksSoftware;
  } catch {
    return false;
  }
}

export function applyHwClass(options = {}) {
  const { recheckOnVisibility = false, respectReducedMotion = true } = options;
  const root = document.documentElement;

  const prefersReducedMotion = () =>
    respectReducedMotion &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const set = () => {
    const hwOn = isHardwareAccelerationEnabled();
    const motionOn = !prefersReducedMotion();

    root.classList.toggle("hw", hwOn);
    root.classList.toggle("no-hw", !hwOn);
    root.classList.toggle("motion", motionOn);
    root.classList.toggle("reduced-motion", !motionOn);

    return { hwOn, motionOn };
  };

  const capabilities = set();

  if (recheckOnVisibility) {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) set();
    });
  }

  return capabilities;
}

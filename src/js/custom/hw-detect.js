export function isHardwareAccelerationEnabled() {
  try {
    const canvas = document.createElement("canvas");
    const attrs = {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    };

    const gl = canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs);

    if (!gl) return false;

    let renderer = "";
    let vendor = "";
    try {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "";
        vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "";
      } else {
        renderer = gl.getParameter(gl.RENDERER) || "";
        vendor = gl.getParameter(gl.VENDOR) || "";
      }
    } catch {}

    const signature = (String(renderer) + " " + String(vendor)).toLowerCase();
    const softwareMarkers = ["swiftshader", "swift shader", "google swiftshader", "llvmpipe", "llvm", "softpipe", "software", "mesa", "angle (swiftshader", "angle (mesa", "warp", "d3d11 warp", "microsoft basic render driver", "basic render", "software adapter", "angle (d3d11 warp", "angle (microsoft"];
    const looksSoftware = softwareMarkers.some((m) => signature.includes(m));

    let maxTextureSize = 0;
    try {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    } catch {}

    if (looksSoftware) return false;
    return !(maxTextureSize && maxTextureSize <= 2048);
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return false;
  }
}

export function isHwOn() {
  return isHardwareAccelerationEnabled() && !prefersReducedMotion();
}

export function applyHwClass(options = {}) {
  const { recheckOnVisibility = false } = options;
  const root = document.documentElement;

  const set = (on) => {
    root.classList.toggle("hw", !!on);
  };

  set(isHwOn());

  // update on visibility back
  if (recheckOnVisibility) {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) set(isHwOn());
    });
  }

  // react to prefers-reduced-motion changes
  try {
    const mql = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql) {
      const onChange = () => set(isHwOn());
      if (typeof mql.addEventListener === "function") mql.addEventListener("change", onChange);
      else if (typeof mql.addListener === "function") mql.addListener(onChange);
    }
  } catch {}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => applyHwClass());
} else {
  applyHwClass();
}

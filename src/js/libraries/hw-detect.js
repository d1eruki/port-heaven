/**
 * Проверяет, доступно ли аппаратное ускорение (GPU) через WebGL/WebGL2.
 * Возвращает true при наличии признаков HW-рендера, иначе false (в т.ч. при SwiftShader/llvmpipe и пр.).
 */
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
    } catch {
      // ignore
    }

    const signature = (String(renderer) + " " + String(vendor)).toLowerCase();
    const softwareMarkers = ["swiftshader", "llvmpipe", "software", "softpipe", "mesa", "angle (swiftshader", "angle (mesa"];
    const looksSoftware = softwareMarkers.some((m) => signature.includes(m));

    let maxTextureSize = 0;
    try {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    } catch {
      // ignore
    }

    if (looksSoftware) return false;
    return !(maxTextureSize && maxTextureSize <= 2048);
  } catch {
    return false;
  }
}

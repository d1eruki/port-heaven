export async function ensureModelViewerLoaded() {
  try {
    if (
      window.customElements &&
      window.customElements.get &&
      window.customElements.get("model-viewer")
    ) {
      return;
    }

    const existing = document.getElementById("model-viewer-cdn");
    if (existing) {
      return await new Promise((resolve) => {
        if (window.customElements.get && window.customElements.get("model-viewer"))
          return resolve();
        // Fallback: poll briefly until defined
        const t = setInterval(() => {
          if (window.customElements.get && window.customElements.get("model-viewer")) {
            clearInterval(t);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(t);
          resolve();
        }, 3000);
      });
    }

    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.id = "model-viewer-cdn";
      s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load model-viewer CDN"));
      document.head.appendChild(s);
    });
  } catch (e) {
    console.warn(e);
  }
}

export function onReady(fn, opts = { once: true }) {
  if (typeof fn !== "function") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, opts);
  } else {
    fn();
  }
}
export const domReady = new Promise((resolve) => onReady(resolve));

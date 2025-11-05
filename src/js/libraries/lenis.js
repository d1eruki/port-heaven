import Lenis from "lenis";

export const lenis = new Lenis({
  autoRaf: true,
  duration: 1.1, // плавность правь по вкусу
  // smoothWheel: true, // включи если надо
});

window.lenis = lenis;

lenis.on("scroll", (e) => {
  const y = e && typeof e.scroll === "number" ? e.scroll : lenis.scroll;
  window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: { y } }));
});

document.addEventListener("scroll-to-top", () => {
  lenis.scrollTo(0);
});

// ---- ПРОГРЕСС-БАР ---------------------------------------------
import { updateProgressBar } from "../custom/progress-bar";

window.addEventListener("lenis-scroll", (e) => {
  try {
    updateProgressBar(e.detail.y);
  } catch {
    updateProgressBar();
  }
});

import { calculateProgress, getScrollY } from "../utils/scroll";

export const updateProgressBar = (scrollY) => {
  const progressBar = document.getElementById("progress-bar");
  if (!progressBar) return;

  const currentY = scrollY !== undefined ? scrollY : getScrollY();
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = calculateProgress(currentY, 0, totalHeight) * 100;

  progressBar.style.height = `${progress}%`;
};

window.addEventListener("beforeunload", () => {
  localStorage.setItem("scrollY", getScrollY().toString());
});

window.addEventListener("load", () => {
  const saved = localStorage.getItem("scrollY");
  if (saved !== null && window.lenis) {
    window.lenis.scrollTo(parseInt(saved, 10), { immediate: true });
  } else if (saved !== null) {
    window.scrollTo(0, parseInt(saved, 10));
  }
  updateProgressBar(getScrollY());
});

window.addEventListener("resize", () => {
  updateProgressBar(getScrollY());
});

window.addEventListener("lenis-scroll", (e) => {
  updateProgressBar(e.detail.y);
});

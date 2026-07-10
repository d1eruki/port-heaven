import { calculateProgress, getScrollY, onScroll } from "../../utils/scroll";
import { DOM_SELECTORS } from "../../dom/dom-selectors";

export const updateProgressBar = (scrollY) => {
  const progressBar = document.querySelector(DOM_SELECTORS.progressBar);
  if (!progressBar) return;

  const currentY = scrollY !== undefined ? scrollY : getScrollY();
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = calculateProgress(currentY, 0, totalHeight) * 100;

  progressBar.style.height = `${progress}%`;
};

export const initProgressBar = () => {
  window.addEventListener("resize", () => {
    updateProgressBar(getScrollY());
  });

  onScroll((scrollY) => updateProgressBar(scrollY));
};

import { calculateProgress, getScrollY } from "../utils/scroll";
import { onScroll, scrollToY as scrollWindowToY } from "../libraries/scroll-instance";
import { DOM_SELECTORS } from "./dom-selectors";

export const updateProgressBar = (scrollY) => {
  const progressBar = document.querySelector(DOM_SELECTORS.progressBar);
  if (!progressBar) return;

  const currentY = scrollY !== undefined ? scrollY : getScrollY();
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = calculateProgress(currentY, 0, totalHeight) * 100;

  progressBar.style.height = `${progress}%`;
};

const SCROLL_STORAGE_KEY = "scrollY";

const resetHorizontalScroll = () => {
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
};

const scrollToY = (y) => {
  resetHorizontalScroll();

  scrollWindowToY(y, { immediate: true });

  requestAnimationFrame(resetHorizontalScroll);
};

const readSavedScrollY = () => {
  let saved = null;
  try {
    saved = localStorage.getItem(SCROLL_STORAGE_KEY);
  } catch {}

  const savedY = Number.parseInt(saved, 10);
  return Number.isFinite(savedY) ? savedY : null;
};

const restoreScrollPosition = () => {
  resetHorizontalScroll();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targetY = readSavedScrollY();
      if (targetY !== null) {
        scrollToY(targetY);
      }

      updateProgressBar(getScrollY());
    });
  });
};

export const initProgressBar = () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("beforeunload", () => {
    try {
      localStorage.setItem(SCROLL_STORAGE_KEY, getScrollY().toString());
    } catch {}
  });

  const onLoad = () => {
    restoreScrollPosition();
  };

  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }

  window.addEventListener("resize", () => {
    updateProgressBar(getScrollY());
  });

  onScroll((scrollY) => updateProgressBar(scrollY));
};

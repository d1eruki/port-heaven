import { calculateProgress, getScrollY } from "../utils/scroll";

export const updateProgressBar = (scrollY) => {
  const progressBar = document.getElementById("progress-bar");
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

  if (window.lenis) {
    window.lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }

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

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  try {
    localStorage.setItem(SCROLL_STORAGE_KEY, getScrollY().toString());
  } catch {}
});

window.addEventListener("load", () => {
  restoreScrollPosition();
});

window.addEventListener("resize", () => {
  updateProgressBar(getScrollY());
});

window.addEventListener("lenis-scroll", (e) => {
  updateProgressBar(e.detail.y);
});

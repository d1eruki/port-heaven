import {
  calculateProgress,
  getScrollY,
  onScroll,
  scrollToY as scrollWindowToY,
} from "../../utils/scroll";
import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

export const updateProgressBar = (scrollY) => {
  const progressBar = document.querySelector(DOM_SELECTORS.progressBar);
  if (!progressBar) return;

  const currentY = scrollY !== undefined ? scrollY : getScrollY();
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = calculateProgress(currentY, 0, totalHeight) * 100;

  progressBar.style.height = `${progress}%`;
};

const SCROLL_STORAGE_KEY = "scrollY";
let hasRestoredScrollPosition = false;

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

const setupProgressBar = () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const onBeforeUnload = () => {
    try {
      localStorage.setItem(SCROLL_STORAGE_KEY, getScrollY().toString());
    } catch {}
  };

  window.addEventListener("beforeunload", onBeforeUnload);

  const onLoad = () => {
    if (hasRestoredScrollPosition) return;
    hasRestoredScrollPosition = true;
    restoreScrollPosition();
  };

  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }

  const onResize = () => {
    updateProgressBar(getScrollY());
  };

  window.addEventListener("resize", onResize);

  const offScroll = onScroll((scrollY) => updateProgressBar(scrollY));

  return () => {
    window.removeEventListener("beforeunload", onBeforeUnload);
    window.removeEventListener("load", onLoad);
    window.removeEventListener("resize", onResize);
    if (typeof offScroll === "function") offScroll();
  };
};

export const initProgressBar = () =>
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.PROGRESS_BAR,
    setup: setupProgressBar,
  });

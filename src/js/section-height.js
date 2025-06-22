import { getHeaderHeight } from "./global-variables";

function throttle(func, delay) {
  let timeoutId;
  return function (...args) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    }
  };
}

function applyHeights() {
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const minWidthPx = 64 * remInPx;
  const isMobile = window.innerWidth < minWidthPx;

  const elementsWithId = Array.from(document.body.children).filter((el) => el.id);
  if (elementsWithId.length < 2) return;

  const middleElements = elementsWithId.slice(1, -1);
  const lastEl = elementsWithId[elementsWithId.length - 1];
  const header = document.querySelector("header");

  if (!header) return;

  header.style.height = "";

  if (isMobile) {
    middleElements.forEach((el) => (el.style.minHeight = ""));
    lastEl.style.minHeight = "";
    return;
  }

  const headerHeight = Math.round(getHeaderHeight());
  header.style.height = `${headerHeight}px`;

  const screenHeight = window.innerHeight;
  const targetHeight = screenHeight - headerHeight;

  middleElements.forEach((el) => {
    el.style.minHeight = `${targetHeight}px`;
  });

  lastEl.style.minHeight = `${targetHeight}px`;
}

const throttledApplyHeights = throttle(applyHeights, 100);

window.addEventListener("DOMContentLoaded", applyHeights);
window.addEventListener("resize", throttledApplyHeights);

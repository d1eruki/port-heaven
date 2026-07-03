export { getScrollY, onScroll, scrollToY } from "../libraries/scroll-instance";
import { isViewportBelow } from "./breakpoints";

export const isMobile = () => isViewportBelow("lg");

export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export const calculateProgress = (current, start, end) => {
  if (start === end) return 0;
  return clamp((current - start) / (end - start), 0, 1);
};

export const initOnLoad = (initFn) => {
  if (document.readyState === "complete") {
    initFn();
  } else {
    window.addEventListener("load", initFn);
  }
};

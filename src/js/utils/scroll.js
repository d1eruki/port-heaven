import { getActiveLenis } from "../libraries/scroll-instance";

export const isMobile = () => window.innerWidth < 1024;

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

export const getScrollY = () => getActiveLenis()?.scroll ?? window.scrollY;

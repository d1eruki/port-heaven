import { getScrollY, onScroll } from "../../utils/scroll";
import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

const setupMenuDotToggler = () => {
  const menuDot = document.querySelector(DOM_SELECTORS.menuDot);
  if (!menuDot) return;

  menuDot.classList.add("flex");
  menuDot.classList.add("lg:opacity-0");

  const getThreshold = () => window.innerHeight / 2;

  let lastState = null;
  let scrollTimer = null;

  const ensureTransitionClasses = () => {
    menuDot.classList.add("transition-opacity", "duration-300", "ease-in-out");
  };
  ensureTransitionClasses();

  const applyState = (shouldShow) => {
    if (lastState === shouldShow) return;
    lastState = shouldShow;
    if (shouldShow) {
      menuDot.classList.remove("lg:opacity-0");
      menuDot.classList.remove("lg:pointer-events-none");
    } else {
      menuDot.classList.add("lg:opacity-0");
      menuDot.classList.add("lg:pointer-events-none");
    }
  };

  const recompute = (scrollY = getScrollY()) => {
    const threshold = getThreshold();
    applyState(scrollY >= threshold);
  };

  const onScrollThrottled = () => {
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      recompute();
    }, 80);
  };

  const offScroll = onScroll(onScrollThrottled);
  window.addEventListener("resize", recompute);

  const initialTimer = setTimeout(recompute, 50);

  return () => {
    if (typeof offScroll === "function") offScroll();
    window.removeEventListener("resize", recompute);
    clearTimeout(initialTimer);
    if (scrollTimer) clearTimeout(scrollTimer);
  };
};

export const initMenuDotToggler = () =>
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.MENU_DOT,
    setup: setupMenuDotToggler,
  });

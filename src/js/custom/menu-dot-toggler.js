import { onReady } from "../utils/onReady";
import { getActiveLenis } from "../libraries/scroll-instance";

export const initMenuDotToggler = () =>
  onReady(() => {
    const menuDot = document.querySelector("body > #menu-dot, #menu-dot");
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

    const getScrollY = (event) => {
      const lenisY = event?.detail?.y ?? getActiveLenis()?.scroll;
      if (typeof lenisY === "number") return lenisY;
      return window.scrollY || window.pageYOffset || 0;
    };

    const recompute = (event) => {
      const threshold = getThreshold();
      const y = getScrollY(event);
      applyState(y >= threshold);
    };

    const onScrollThrottled = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        recompute();
      }, 80);
    };

    window.addEventListener("scroll", onScrollThrottled, { passive: true });
    window.addEventListener("lenis-scroll", recompute);
    window.addEventListener("resize", recompute);

    setTimeout(recompute, 50);
  });

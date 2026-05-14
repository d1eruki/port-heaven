import { onReady } from "../utils/onReady";

export const initMenuDotToggler = () => onReady(() => {
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

  const recompute = () => {
    const threshold = getThreshold();
    const y = window.scrollY || window.pageYOffset || 0;
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
  window.addEventListener("resize", recompute);

  setTimeout(recompute, 50);
});

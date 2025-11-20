import { onReady } from "../utils/onReady";

onReady(() => {
  const header = document.querySelector("body > header, header");
  if (!header) return;

  header.classList.add("flex");
  header.classList.add("lg:opacity-0");

  const getThreshold = () => window.innerHeight / 2;

  let lastState = null;
  let scrollTimer = null;

  const ensureTransitionClasses = () => {
    header.classList.add("transition-opacity", "duration-300", "ease-in-out");
  };
  ensureTransitionClasses();

  const applyState = (shouldShow) => {
    if (lastState === shouldShow) return;
    lastState = shouldShow;
    if (shouldShow) {
      header.classList.remove("lg:opacity-0");
      header.classList.remove("lg:pointer-events-none");
    } else {
      header.classList.add("lg:opacity-0");
      header.classList.add("lg:pointer-events-none");
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

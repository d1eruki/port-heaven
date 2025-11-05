document.addEventListener("DOMContentLoaded", () => {
  const menuDot = document.querySelector("body > #menu-dot, #menu-dot");
  if (!menuDot) return;

  // Keep base `hidden` so menuDot is never shown on small screens.
  // On lg+, start from transparent and fade in/out by toggling `lg:opacity-0`.
  menuDot.classList.add("flex");
  menuDot.classList.add("lg:opacity-0");

  const getThreshold = () => window.innerHeight / 2; // 50dvh equivalent at runtime

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
      // Show only on lg+ by removing lg:opacity-0. Keep base hidden to stay hidden on small screens.
      menuDot.classList.remove("lg:opacity-0");
      menuDot.classList.remove("lg:pointer-events-none");
    } else {
      // Hide on lg+ again (fade out) and block interactions while invisible
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

  // Initial check after a short delay to let layout settle
  setTimeout(recompute, 50);
});

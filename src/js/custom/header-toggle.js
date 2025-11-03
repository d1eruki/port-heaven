document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("body > header, header");
  if (!header) return;

  // Keep base `hidden` so header is never shown on small screens.
  // On lg+, start from transparent and fade in/out by toggling `lg:opacity-0`.
  header.classList.add("flex");
  header.classList.add("lg:opacity-0");

  const getThreshold = () => window.innerHeight / 2; // 50dvh equivalent at runtime

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
      // Show only on lg+ by removing lg:opacity-0. Keep base hidden to stay hidden on small screens.
      header.classList.remove("lg:opacity-0");
      header.classList.remove("lg:pointer-events-none");
    } else {
      // Hide on lg+ again (fade out) and block interactions while invisible
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

  // Initial check after a short delay to let layout settle
  setTimeout(recompute, 50);
});

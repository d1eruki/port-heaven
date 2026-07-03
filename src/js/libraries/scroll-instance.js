let activeLenis = null;

export const setActiveLenis = (lenis) => {
  activeLenis = lenis || null;
};

export const getScrollY = () => activeLenis?.scroll ?? window.scrollY ?? window.pageYOffset ?? 0;

export const scrollToY = (y, options = {}) => {
  const targetY = Math.max(0, Math.round(Number(y) || 0));

  if (activeLenis && typeof activeLenis.scrollTo === "function") {
    activeLenis.scrollTo(targetY, options);
    return;
  }

  if (options.immediate) {
    window.scrollTo(0, targetY);
    return;
  }

  window.scrollTo({ top: targetY, left: 0, behavior: options.behavior || "smooth" });
};

export const onScroll = (handler) => {
  if (activeLenis && typeof activeLenis.on === "function") {
    return activeLenis.on("scroll", (event) => {
      handler(event?.scroll ?? activeLenis.scroll ?? getScrollY(), event);
    });
  }

  const nativeHandler = (event) => handler(getScrollY(), event);
  window.addEventListener("scroll", nativeHandler, { passive: true });

  return () => window.removeEventListener("scroll", nativeHandler);
};

const heroImage = document.querySelector(".hero-image");

if (heroImage) {
  // Prepare composition layer and avoid transition-induced jank on scroll
  heroImage.style.willChange = "transform";
  heroImage.style.transformOrigin = "center center";
  // Do NOT set transition on transform for scroll-driven effects

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  const baseScale = 1;
  const minScale = 0.95; // narrower range reduces resampling artifacts
  const maxScale = 1.05;
  const perPixelFactor = 0.0002; // sensitivity per pixel of vertical scroll

  let initialScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let latestY = initialScrollY;
  let targetScale = baseScale;
  let currentScale = baseScale;
  let ticking = false;

  const lerp = (a, b, t) => a + (b - a) * t; // smoothing

  const update = () => {
    ticking = false;
    const deltaY = latestY - initialScrollY;
    targetScale = clamp(baseScale + deltaY * perPixelFactor, minScale, maxScale);

    // ease current value towards target to smooth out scroll bursts
    currentScale = lerp(currentScale, targetScale, 0.2);
    heroImage.style.transform = `scale(${currentScale})`;

    if (Math.abs(currentScale - targetScale) > 0.0005) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  const onScroll = () => {
    latestY = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  // Initialize
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Reset base when page fully loaded (handles anchors/refresh at offset)
  window.addEventListener("load", () => {
    initialScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  });
}

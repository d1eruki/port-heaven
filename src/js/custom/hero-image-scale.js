const heroImage = document.querySelector(".hero-image");

if (heroImage) {
  heroImage.style.transition = "transform 0.3s ease-out";

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  const baseScale = 1;
  const minScale = 0.5;
  const maxScale = 2;
  const initialScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  // Scale sensitivity per pixel of vertical scroll
  const perPixelFactor = 0.0001;

  const applyScale = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const deltaY = scrollY - initialScrollY;
    const targetScale = clamp(baseScale + deltaY * perPixelFactor, minScale, maxScale);
    heroImage.style.transform = `scale(${targetScale})`;
  };

  // Initialize
  applyScale();

  // Keep scale in sync with actual scroll position for perfect reversibility
  window.addEventListener("scroll", applyScale, { passive: true });
}

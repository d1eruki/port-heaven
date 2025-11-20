const heroImages = document.querySelectorAll(".hero-image");

if (heroImages.length) {
  heroImages.forEach((el) => {
    el.style.transition = el.style.transition || "transform 0.3s ease-out";
  });

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  const baseScale = 1;
  const minScale = 0.5;
  const maxScale = 2;
  const initialScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  const perPixelFactor = 0.0001;

  const applyScale = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const deltaY = scrollY - initialScrollY;
    const targetScale = clamp(baseScale + deltaY * perPixelFactor, minScale, maxScale);
    heroImages.forEach((el) => {
      el.style.setProperty("--heroScale", String(targetScale));
    });
  };

  applyScale();

  window.addEventListener("scroll", applyScale, { passive: true });
}

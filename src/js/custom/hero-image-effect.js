import { lenis } from "../libraries/lenis";

const heroImages = document.querySelectorAll(".hero-image");

if (heroImages.length) {
  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  // Parallax
  const PARALLAX_SPEED = 0.5;

  // Scale
  const baseScale = 1;
  const minScale = 0.5;
  const maxScale = 2;
  const perPixelFactor = 0.0001;

  const updateHeroEffect = (scroll) => {
    // Parallax
    const offset = scroll * PARALLAX_SPEED;

    // Scale
    const targetScale = clamp(baseScale + scroll * perPixelFactor, minScale, maxScale);

    heroImages.forEach((el) => {
      el.style.setProperty("--parallaxY", offset + "px");
      el.style.setProperty("--heroScale", String(targetScale));
    });
  };

  updateHeroEffect(lenis.scroll);

  lenis.on("scroll", (e) => {
    const scroll = e && typeof e.scroll === "number" ? e.scroll : lenis.scroll;
    updateHeroEffect(scroll);
  });
}

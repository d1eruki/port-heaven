import { lenis } from "../libraries/lenis";

const heroImages = document.querySelectorAll(".hero-image");

if (heroImages.length) {
  const PARALLAX_SPEED = 0.5;

  lenis.on("scroll", (e) => {
    const scroll = e && typeof e.scroll === "number" ? e.scroll : lenis.scroll;
    const offset = scroll * PARALLAX_SPEED;
    heroImages.forEach((el) => {
      el.style.setProperty("--parallaxY", offset + "px");
    });
  });
}

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ENABLE_SCROLL_DEBUG = false;

ScrollTrigger.defaults({
  markers: process.env.NODE_ENV !== "production" && ENABLE_SCROLL_DEBUG,
});

export const getScrollSmoother = () => ScrollSmoother.get() ?? null;

export const initScrollSmoother = () => {
  const currentSmoother = getScrollSmoother();
  if (currentSmoother) return currentSmoother;

  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.1,
    effects: "[data-hero-parallax]",
  });

  const heroImage = document.querySelector("[data-hero-parallax]");
  const hero = heroImage?.closest("section");

  if (heroImage && hero) {
    gsap.to(heroImage, {
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        id: "hero-scale",
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }

  return smoother;
};

export { gsap, ScrollSmoother, ScrollTrigger };

import { gsap, ScrollTrigger } from "../../libraries/gsap-scroll";
import { getBreakpointPx } from "../../utils/breakpoints";

export const initCreativeParallax = () => {
  const section = document.getElementById("creatives");
  const items = section?.querySelectorAll("[data-creative-cloud-item]");
  if (!section || !items?.length) return;

  const breakpointLg = getBreakpointPx("lg");
  const media = gsap.matchMedia();

  media.add(`(max-width: ${breakpointLg - 0.02}px)`, () => {
    const animations = Array.from(items, (item) => {
      const depth = Number(item.dataset.depth) || 0.5;

      return gsap.fromTo(
        item,
        {
          y: () => window.innerHeight * 0.04 * depth,
        },
        {
          y: () => -window.innerHeight * 0.04 * depth,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      animations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
    };
  });

  media.add(`(min-width: ${breakpointLg}px)`, () => {
    const animations = Array.from(items, (item) => {
      const depth = Number(item.dataset.depth) || 0.5;
      const driftX = Number(item.dataset.driftX) || 0;
      const driftY = Number(item.dataset.driftY) || 16;

      return gsap.fromTo(
        item,
        {
          xPercent: -driftX * depth,
          y: () => window.innerHeight * 0.35 * depth,
        },
        {
          xPercent: driftX * depth,
          y: () => -window.innerHeight * (driftY / 30) * depth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      animations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
    };
  });

  ScrollTrigger.refresh();
};

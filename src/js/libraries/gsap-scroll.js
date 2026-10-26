import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBreakpointPx } from "../utils/breakpoints";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ENABLE_SCROLL_DEBUG = false;

ScrollTrigger.defaults({
  markers: process.env.NODE_ENV !== "production" && ENABLE_SCROLL_DEBUG,
});

export const getScrollSmoother = () => ScrollSmoother.get() ?? null;
let scrollMedia;

export const initScrollSmoother = () => {
  if (scrollMedia) return getScrollSmoother();

  const heroImage = document.querySelector("[data-hero-parallax]");
  const hero = heroImage?.closest("section");

  scrollMedia = gsap.matchMedia();
  scrollMedia.add(
    {
      desktop: `(min-width: ${getBreakpointPx("lg")}px)`,
      mobile: `(width < ${getBreakpointPx("lg")}px)`,
    },
    ({ conditions }) => {
      const smoother = conditions.desktop
        ? ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.1,
            normalizeScroll: false,
            effects: "[data-hero-parallax]",
          })
        : null;

      let heroAnimation;
      let heroObserver;
      // Нулевая прокрутка всегда соответствует исходному положению персонажа.
      if (heroImage && hero && conditions.mobile) {
        if ("ScrollTimeline" in window) {
          let heroHeight = hero.offsetHeight;
          const frames = () => [
            { transform: "translate3d(0, 0, 0) scale(1)" },
            { transform: `translate3d(0, ${heroHeight / 2}px, 0) scale(1.08)` },
          ];
          heroAnimation = heroImage.animate(frames(), {
            timeline: new window.ScrollTimeline({
              source: document.scrollingElement,
              axis: "block",
            }),
            rangeStart: "0px",
            rangeEnd: `${heroHeight}px`,
            fill: "both",
            easing: "linear",
          });
          heroObserver = new ResizeObserver(() => {
            if (hero.offsetHeight === heroHeight) return;
            heroHeight = hero.offsetHeight;
            heroAnimation.effect.setKeyframes(frames());
            heroAnimation.rangeEnd = `${heroHeight}px`;
          });
          heroObserver.observe(hero);
        } else {
          gsap.fromTo(
            heroImage,
            { y: 0, scale: 1 },
            {
              y: () => hero.offsetHeight / 2,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                id: "hero-mobile-parallax",
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.15,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      }

      if (heroImage && hero && conditions.desktop)
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

      return () => {
        heroObserver?.disconnect();
        heroAnimation?.cancel();
        smoother?.kill();
      };
    },
  );

  if (import.meta.hot)
    import.meta.hot.dispose(() => {
      scrollMedia.revert();
      scrollMedia = undefined;
    });
  return getScrollSmoother();
};

export { gsap, ScrollTrigger };

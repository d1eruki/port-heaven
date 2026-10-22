import { gsap } from "../../libraries/gsap-scroll";

export const initReviews = () => {
  const section = document.getElementById("reviews");
  const background = section?.querySelector("[data-reviews-background]");

  if (!background) return;

  gsap.fromTo(
    background,
    { yPercent: -10 },
    {
      yPercent: 10,
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
};

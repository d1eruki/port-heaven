import { gsap } from "../../libraries/gsap-scroll";
import { onReady } from "../../utils/onReady";

const setupAboutReveal = () => {
  const section = document.getElementById("about");
  const features = section?.querySelectorAll("[data-about-feature]");

  if (!section || !features?.length) return;

  gsap.fromTo(
    features,
    {
      autoAlpha: 0,
      y: 48,
      scale: 1,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: {
        id: "about-features-reveal",
        trigger: section,
        start: "top 75%",
        once: true,
      },
    },
  );
};

export const initAboutReveal = () => onReady(setupAboutReveal);

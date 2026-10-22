import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { gsap } from "../../libraries/gsap-scroll";

export const initProgressBar = () => {
  const progressBar = document.querySelector(DOM_SELECTORS.progressBar);
  if (!progressBar) return;

  gsap.to(progressBar, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
};

import { SECTION_IDS } from "../../dom/dom-selectors";
import { gsap, ScrollTrigger } from "../../libraries/gsap-scroll";
import { getBreakpointPx } from "../../utils/breakpoints";

export const initCreativeHeadingPin = () => {
  const section = document.getElementById(SECTION_IDS.creatives);
  const headingWrapper = section?.querySelector("[data-creatives-heading-pin]");
  if (!section || !headingWrapper) return;

  gsap.matchMedia().add(`(min-width: ${getBreakpointPx("lg")}px)`, () => {
    ScrollTrigger.create({
      id: "creatives-pin",
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: headingWrapper,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });
  });
};

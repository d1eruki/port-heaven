import { SECTION_IDS } from "../../dom/dom-selectors";
import { gsap, ScrollTrigger } from "../../libraries/gsap-scroll";
import { getBreakpointPx } from "../../utils/breakpoints";

export const initProjectPin = () => {
  const section = document.getElementById(SECTION_IDS.projects);
  const panel = section?.firstElementChild;
  if (!section || !panel) return;

  gsap.matchMedia().add(`(min-width: ${getBreakpointPx("lg")}px)`, () => {
    ScrollTrigger.create({
      id: "projects-pin",
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: panel,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });
  });
};

import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { getScrollSmoother, gsap, ScrollTrigger } from "../../libraries/gsap-scroll";
import { getBreakpointPx } from "../../utils/breakpoints";

export const initSectionSnap = () => {
  const sections = Array.from(document.querySelectorAll(DOM_SELECTORS.sections));
  const projects = Array.from(document.querySelectorAll(DOM_SELECTORS.projectSnap));
  if (!sections.length) return;

  const targets = [...sections, ...projects];

  gsap.matchMedia().add(`(min-width: ${getBreakpointPx("lg")}px)`, () => {
    ScrollTrigger.create({
      id: "section-snap",
      scroller: window,
      start: 0,
      end: "max",
      snap: {
        snapTo: (value, self) => {
          const smoother = getScrollSmoother();
          const maxScroll = ScrollTrigger.maxScroll(window);
          if (!smoother || maxScroll <= 0) return value;

          const points = [
            ...new Set(
              targets.map((element) =>
                gsap.utils.clamp(0, 1, smoother.offset(element, "top top") / maxScroll),
              ),
            ),
          ].sort((a, b) => a - b);
          const snappedValue = ScrollTrigger.snapDirectional(points)(value, self.direction);
          const threshold = (window.innerHeight * 0.75) / maxScroll;

          return Math.abs(snappedValue - value) <= threshold ? snappedValue : value;
        },
        delay: 0.05,
        duration: 0.5,
        inertia: false,
      },
      invalidateOnRefresh: true,
    });
  });
};

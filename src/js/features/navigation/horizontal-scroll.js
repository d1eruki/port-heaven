import { gsap } from "../../libraries/gsap-scroll";
import { DOM_IDS } from "../../dom/dom-selectors";
import { getBreakpointPx } from "../../utils/breakpoints";

export const initHorizontalScroll = () => {
  const section = document.getElementById(DOM_IDS.design);
  const inner = document.getElementById(DOM_IDS.designInner);
  const viewport = document.getElementById(DOM_IDS.designViewport);
  if (!section || !inner || !viewport) return;

  const frame = inner.parentElement;
  const getScrollDistance = () => Math.max(0, inner.scrollWidth - frame.clientWidth);

  gsap.matchMedia().add(`(min-width: ${getBreakpointPx("lg")}px)`, () => {
    gsap.set(inner, { overflow: "visible" });
    gsap.to(inner, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        id: "design-horizontal",
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: viewport,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
};

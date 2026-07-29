import { onReady } from "../../utils/onReady";
import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { ScrollTrigger } from "../../libraries/gsap-scroll";

export const initMenuDotToggler = () =>
  onReady(() => {
    const menuDot = document.querySelector(DOM_SELECTORS.menuDot);
    if (!menuDot) return;

    menuDot.classList.add("flex");
    menuDot.classList.add("lg:opacity-0");

    let lastState = null;

    const ensureTransitionClasses = () => {
      menuDot.classList.add("transition-opacity", "duration-300", "ease-in-out");
    };
    ensureTransitionClasses();

    const applyState = (shouldShow) => {
      if (lastState === shouldShow) return;
      lastState = shouldShow;
      if (shouldShow) {
        menuDot.classList.remove("lg:opacity-0");
        menuDot.classList.remove("lg:pointer-events-none");
      } else {
        menuDot.classList.add("lg:opacity-0");
        menuDot.classList.add("lg:pointer-events-none");
      }
    };

    ScrollTrigger.create({
      start: () => window.innerHeight / 2,
      end: "max",
      onEnter: () => applyState(true),
      onLeaveBack: () => applyState(false),
      onRefresh: (self) => applyState(self.scroll() >= self.start),
      invalidateOnRefresh: true,
    });
  });

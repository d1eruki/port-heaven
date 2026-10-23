import { onReady } from "../../utils/on-ready";
import { getBreakpointPx } from "../../utils/breakpoints";
import { DOM_IDS, DOM_SELECTORS } from "../../dom/dom-selectors";
import { gsap } from "../../libraries/gsap-scroll";

const setupDesignActive = () => {
  const scroller = document.getElementById(DOM_IDS.designInner);
  if (!scroller) return;

  gsap.matchMedia().add(`(width < ${getBreakpointPx("lg")}px)`, () => {
    const cards = Array.from(scroller.querySelectorAll(DOM_SELECTORS.designItems));
    let frame = null;

    const updateActiveCard = () => {
      frame = null;
      const bounds = scroller.getBoundingClientRect();
      const centerX = bounds.left + scroller.clientWidth / 2;
      let activeCard = null;
      let minDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.right <= bounds.left || rect.left >= bounds.right) return;

        const distance = Math.abs(rect.left + rect.width / 2 - centerX);
        if (distance < minDistance) {
          minDistance = distance;
          activeCard = card;
        }
      });

      cards.forEach((card) => {
        card.classList.toggle("design-active", card === activeCard);
      });
    };

    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updateActiveCard);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", scheduleUpdate, { passive: true });
    updateActiveCard();

    return () => {
      scroller.removeEventListener("scroll", scheduleUpdate);
      resizeObserver.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      cards.forEach((card) => card.classList.remove("design-active"));
    };
  });
};

export const initDesignActive = () => onReady(setupDesignActive);

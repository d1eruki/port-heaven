import Snap from "lenis/snap";

import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { lenis } from "../../libraries/lenis";
import { isViewportAtLeast } from "../../utils/breakpoints";

export const initSectionSnap = () => {
  const sections = document.querySelectorAll(DOM_SELECTORS.sections);
  const projects = document.querySelectorAll(DOM_SELECTORS.projectSnap);
  if (!sections.length) return;

  const snap = new Snap(lenis, {
    type: "proximity",
    distanceThreshold: "18%",
    debounce: 180,
    duration: 0.8,
  });

  snap.addElements(sections, { align: "start" });
  snap.addElements(projects, { align: "start" });

  let enabled = true;

  const syncWithViewport = () => {
    const shouldEnable = isViewportAtLeast("lg");
    if (shouldEnable === enabled) return;

    enabled = shouldEnable;
    if (enabled) snap.start();
    else snap.stop();
  };

  window.addEventListener("resize", syncWithViewport, { passive: true });
  syncWithViewport();
};

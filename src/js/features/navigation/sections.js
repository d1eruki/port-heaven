import { onReady } from "../../utils/onReady";
import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { initSectionDots } from "./section-dots/init-section-dots";

export const initSections = () => {
  const init = () =>
    initSectionDots({
      sectionSelector: DOM_SELECTORS.sectionNavTargets,
      navSelector: DOM_SELECTORS.sectionNav,
      offset: 0,
      throttleMs: 80,
      switchThresholdPx: 48,
      centerAssist: true,
      centerBiasPx: 12,
      minActivateVisiblePx: 96,
      debug: false,
    });

  onReady(init);
};

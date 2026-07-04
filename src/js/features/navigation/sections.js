import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";
import { VARIANT_FEATURES } from "../../variants/registry";
import { initSectionDots } from "./section-dots/init-section-dots";

export const initSections = () => {
  let cleanup = null;

  const cleanupSections = () => {
    if (typeof cleanup === "function") cleanup();
    cleanup = null;
  };

  const init = () => {
    cleanupSections();

    cleanup = initSectionDots({
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
  };

  onVariantLayoutReady({
    feature: VARIANT_FEATURES.SECTION_DOTS,
    setup: init,
    cleanup: cleanupSections,
  });
};

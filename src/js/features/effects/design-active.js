import { isViewportBelow } from "../../utils/breakpoints";
import { DOM_IDS, DOM_SELECTORS } from "../../dom/dom-selectors";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

const setupDesignActive = () => {
  const isMobile = () => isViewportBelow("md");

  const designSection = document.getElementById(DOM_IDS.design);
  if (!designSection) return;

  const options = {
    root: null,
    rootMargin: "-45% 0% -45% 0%",
    threshold: [0, 1],
  };

  let trackedElements = new Set();

  const designObserver = new IntersectionObserver((entries) => {
    const mobile = isMobile();

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackedElements.add(entry.target);
      } else {
        trackedElements.delete(entry.target);
        entry.target.classList.remove("design-active");
      }
    });

    if (!mobile) {
      trackedElements.forEach((el) => el.classList.remove("design-active"));
      return;
    }

    let activeElement = null;
    let minDistance = Infinity;
    const centerY = window.innerHeight / 2;

    trackedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenterY - centerY);

      if (distance < minDistance) {
        minDistance = distance;
        activeElement = el;
      }
    });

    trackedElements.forEach((el) => {
      if (el === activeElement) {
        if (!el.classList.contains("design-active")) {
          el.classList.add("design-active");
        }
      } else {
        if (el.classList.contains("design-active")) {
          el.classList.remove("design-active");
        }
      }
    });
  }, options);

  const observerCallback = () => {
    const designs = designSection.querySelectorAll(DOM_SELECTORS.designItems);

    if (designs.length > 0) {
      designs.forEach((a) => {
        designObserver.observe(a);
      });
    } else {
      const anyA = designSection.querySelectorAll("a");
      if (anyA.length > 0) {
        anyA.forEach((a) => designObserver.observe(a));
      }
    }
  };

  const mutationObserver = new MutationObserver(observerCallback);
  mutationObserver.observe(designSection, { childList: true, subtree: true });

  observerCallback();

  return () => {
    mutationObserver.disconnect();
    designObserver.disconnect();
    trackedElements.forEach((el) => el.classList.remove("design-active"));
    trackedElements = new Set();
  };
};

export const initDesignActive = () =>
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.DESIGN_ACTIVE,
    setup: setupDesignActive,
  });

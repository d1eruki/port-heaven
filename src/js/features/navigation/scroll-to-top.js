import { smoothScrollTop } from "../../utils/smooth-scroll";
import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

export const initScrollToTop = () => {
  let cleanup = null;

  const cleanupScrollToTop = () => {
    if (typeof cleanup === "function") cleanup();
    cleanup = null;
  };

  const init = () => {
    cleanupScrollToTop();

    const scrollIcon = document.querySelector(DOM_SELECTORS.scrollToTop);
    if (!scrollIcon) return;

    function onClick(e) {
      e?.preventDefault?.();
      smoothScrollTop();
    }

    scrollIcon.addEventListener("click", onClick);

    cleanup = () => {
      scrollIcon.removeEventListener("click", onClick);
    };
  };

  onVariantLayoutReady({
    setup: init,
    cleanup: cleanupScrollToTop,
  });
};

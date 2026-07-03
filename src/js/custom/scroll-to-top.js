import { smoothScrollTop } from "../utils/smooth-scroll";
import { onReady } from "../utils/onReady";
import { DOM_SELECTORS } from "./dom-selectors";

export const initScrollToTop = () =>
  onReady(() => {
    const scrollIcon = document.querySelector(DOM_SELECTORS.scrollToTop);
    if (!scrollIcon) return;

    function onClick(e) {
      e?.preventDefault?.();
      smoothScrollTop();
    }

    scrollIcon.addEventListener("click", onClick);
  });

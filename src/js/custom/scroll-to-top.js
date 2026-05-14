import { smoothScrollTop } from "../utils/smooth-scroll";
import { onReady } from "../utils/onReady";

export const initScrollToTop = () => onReady(() => {
  const scrollIcon = document.querySelector("#scroll-to-top, [data-scroll-to-top]");
  if (!scrollIcon) return;

  function onClick(e) {
    e?.preventDefault?.();
    smoothScrollTop();
  }

  scrollIcon.addEventListener("click", onClick);
});

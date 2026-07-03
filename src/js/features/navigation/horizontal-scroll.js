import { getScrollY, onScroll, isMobile, calculateProgress, initOnLoad } from "../../utils/scroll";
import { DOM_IDS, DOM_SELECTORS } from "../../dom/dom-selectors";

const setupHorizontalScroll = () => {
  const section = document.getElementById(DOM_IDS.design);
  const inner = document.getElementById(DOM_IDS.designInner);
  if (!section || !inner) return;

  const intro = inner.querySelector(DOM_SELECTORS.designIntro);

  const update = () => {
    if (isMobile()) {
      inner.style.transform = "none";
      if (intro) intro.style.transform = "none";
      section.style.height = "auto";
      inner.style.position = "relative";
      inner.style.overflowX = "auto";
      return;
    }

    const innerWidth = inner.scrollWidth;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const horizontalDistance = innerWidth - viewportWidth;
    const dynamicSectionHeight = horizontalDistance + viewportHeight;

    section.style.height = `${dynamicSectionHeight}px`;
    inner.style.position = "sticky";
    inner.style.overflow = "visible";
    inner.style.display = "grid";

    section.style.overflow = "visible";

    const sectionHeight = section.offsetHeight;
    const start = section.offsetTop;
    const scroll = getScrollY();

    const progress = calculateProgress(scroll, start, start + (sectionHeight - viewportHeight));

    const maxTranslate = innerWidth - viewportWidth;
    const translateX = -progress * maxTranslate;

    inner.style.transform = `translateX(${translateX}px)`;
  };

  update();
  onScroll(update);
  window.addEventListener("resize", update);
};

export const initHorizontalScroll = () => initOnLoad(setupHorizontalScroll);

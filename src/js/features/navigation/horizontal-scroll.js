import { getScrollY, onScroll, isMobile, calculateProgress, initOnLoad } from "../../utils/scroll";
import { DOM_IDS, DOM_SELECTORS } from "../../dom/dom-selectors";

const setupHorizontalScroll = () => {
  const section = document.getElementById(DOM_IDS.design);
  const inner = document.getElementById(DOM_IDS.designInner);
  if (!section || !inner) return;

  const intro = inner.querySelector(DOM_SELECTORS.designIntro);

  let isDesktopLayout = false;
  let sectionStart = 0;
  let scrollDistance = 0;
  let measureFrame = null;

  const render = (scrollY = getScrollY()) => {
    if (!isDesktopLayout) return;

    const progress = calculateProgress(scrollY, sectionStart, sectionStart + scrollDistance);

    inner.style.transform = `translateX(${-progress * scrollDistance}px)`;
  };

  const measure = () => {
    if (isMobile()) {
      isDesktopLayout = false;
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

    scrollDistance = Math.max(0, innerWidth - viewportWidth);

    section.style.height = `${scrollDistance + viewportHeight}px`;
    inner.style.position = "sticky";
    inner.style.overflow = "visible";
    inner.style.display = "grid";

    section.style.overflow = "visible";

    sectionStart = section.offsetTop;
    isDesktopLayout = true;
    render();
  };

  const scheduleMeasure = () => {
    if (measureFrame !== null) return;

    measureFrame = requestAnimationFrame(() => {
      measureFrame = null;
      measure();
    });
  };

  measure();
  onScroll((scrollY) => render(scrollY));
  window.addEventListener("resize", scheduleMeasure);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(inner);
  }
};

export const initHorizontalScroll = () => initOnLoad(setupHorizontalScroll);

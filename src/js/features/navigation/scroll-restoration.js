import { DOM_SELECTORS } from "../../dom/dom-selectors";
import { calculateProgress, getScrollY, scrollToY } from "../../utils/scroll";

const SCROLL_POSITION_STORAGE_KEY = "scroll-position";

const getSections = () => Array.from(document.querySelectorAll(DOM_SELECTORS.sections));

const getCurrentSection = (scrollY) => {
  const sections = getSections();

  return (
    sections.find((section) => {
      const start = section.offsetTop;
      return scrollY >= start && scrollY < start + section.offsetHeight;
    }) ?? sections.at(-1)
  );
};

const saveScrollPosition = () => {
  const scrollY = getScrollY();
  const section = getCurrentSection(scrollY);
  if (!section) return;

  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 0);
  const progress = scrollableDistance
    ? calculateProgress(scrollY, section.offsetTop, section.offsetTop + scrollableDistance)
    : 0;

  try {
    localStorage.setItem(
      SCROLL_POSITION_STORAGE_KEY,
      JSON.stringify({ sectionId: section.id, progress }),
    );
  } catch {}
};

const readScrollPosition = () => {
  try {
    const value = JSON.parse(localStorage.getItem(SCROLL_POSITION_STORAGE_KEY));
    if (
      typeof value?.sectionId === "string" &&
      Number.isFinite(value?.progress) &&
      value.progress >= 0 &&
      value.progress <= 1
    ) {
      return value;
    }
  } catch {}

  return null;
};

const resetHorizontalScroll = () => {
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
};

const restoreScrollPosition = () => {
  const savedPosition = readScrollPosition();
  if (!savedPosition) return;

  const section = document.getElementById(savedPosition.sectionId);
  if (!section) return;

  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 0);
  const targetY = section.offsetTop + savedPosition.progress * scrollableDistance;

  resetHorizontalScroll();
  scrollToY(targetY, { immediate: true });
  requestAnimationFrame(resetHorizontalScroll);
};

const restoreAfterLayout = () => {
  requestAnimationFrame(() => requestAnimationFrame(restoreScrollPosition));
};

export const initScrollRestoration = () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("beforeunload", saveScrollPosition);

  if (document.readyState === "complete") {
    restoreAfterLayout();
  } else {
    window.addEventListener("load", restoreAfterLayout, { once: true });
  }
};

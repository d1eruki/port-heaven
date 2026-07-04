import { lenis } from "../../libraries/lenis";
import { getScrollY, initOnLoad, onScroll } from "../../utils/scroll";
import {
  chooseActiveSectionId,
  getViewportMetrics,
  measureSections,
} from "./section-dots/active-section";

const EPS = 8;
const DELTA_THRESHOLD = 2;
const LOCK_MS = 800;

let teardownSectionScroll = null;
let isListeningForLayoutChange = false;

const isLancet = () => document.documentElement.getAttribute("data-variant") === "lancet";

const clearSectionScroll = () => {
  if (typeof teardownSectionScroll === "function") teardownSectionScroll();
  teardownSectionScroll = null;
};

const setupSectionScroll = () => {
  clearSectionScroll();
  if (!isLancet()) return;

  const sections = Array.from(document.querySelectorAll(".lancet-shell [data-section]"));
  if (!sections.length) return;

  let locked = false;
  let unlockTimer = null;
  let activeId = "";
  let lastY = getScrollY();
  let ticking = false;

  const unlock = () => {
    if (unlockTimer) clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => {
      locked = false;
      unlockTimer = null;
    }, LOCK_MS);
  };

  const resolveActiveId = (scrollDir) => {
    const viewport = getViewportMetrics({
      offset: 0,
      centerBiasPx: 12,
    });
    const metrics = measureSections(sections, viewport);

    return chooseActiveSectionId({
      metrics,
      viewport,
      activeId,
      scrollDir,
      cfg: {
        minActivateVisiblePx: 96,
        switchThresholdPx: 48,
        centerAssist: true,
      },
    });
  };

  const setActiveNavButton = (nextActiveId) => {
    if (nextActiveId === activeId) return;
    activeId = nextActiveId || "";

    const navButtons = document.querySelectorAll(".lancet-shell [data-scroll-target]");
    navButtons.forEach((btn) => {
      btn.classList.remove("!text-white");
    });

    const activeButton = activeId
      ? document.querySelector(`.lancet-shell [data-scroll-target="[data-section='${activeId}']"]`)
      : null;
    if (activeButton) activeButton.classList.add("!text-white");
  };

  const updateActiveNavButton = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = getScrollY();
      const dy = y - lastY;
      const scrollDir = Math.abs(dy) < 0.5 ? 0 : dy > 0 ? 1 : -1;
      lastY = y;

      setActiveNavButton(resolveActiveId(scrollDir));
      ticking = false;
    });
  };

  const scrollToElement = (target) => {
    if (!target) return;

    locked = true;
    lenis.scrollTo(target, {
      duration: 1.1,
      lock: true,
    });
    unlock();
  };

  const onWheel = (event) => {
    if (!isLancet()) return;

    const dy = event.deltaY || 0;
    const absY = Math.abs(dy);
    const absX = Math.abs(event.deltaX || 0);
    if (absY < DELTA_THRESHOLD || absY < 2 * absX) return;

    if (locked) {
      event.preventDefault();
      return;
    }

    const hero = document.getElementById("me");
    const about = document.getElementById("about");
    if (!hero || !about) return;

    const heroRect = hero.getBoundingClientRect();
    const aboutRect = about.getBoundingClientRect();
    const vh = window.innerHeight;

    if (dy > 0 && heroRect.bottom <= vh + EPS && aboutRect.top > EPS) {
      event.preventDefault();
      scrollToElement(about);
      return;
    }

    if (dy < 0 && aboutRect.top >= -EPS && heroRect.bottom < vh - EPS) {
      event.preventDefault();
      scrollToElement(hero);
    }
  };

  const onClick = (event) => {
    const navButton = event.target.closest(".lancet-shell [data-scroll-target]");
    if (!navButton) return;

    const targetSelector = navButton.getAttribute("data-scroll-target");
    if (!targetSelector) return;

    const targetSection = document.querySelector(`.lancet-shell ${targetSelector}`);
    if (!targetSection) return;

    event.preventDefault();
    setActiveNavButton(targetSection.id);
    scrollToElement(targetSection);
  };

  const offScroll = onScroll(updateActiveNavButton);
  window.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("click", onClick);
  updateActiveNavButton();

  teardownSectionScroll = () => {
    if (typeof offScroll === "function") offScroll();
    window.removeEventListener("wheel", onWheel, { passive: false });
    document.removeEventListener("click", onClick);
    if (unlockTimer) clearTimeout(unlockTimer);
  };
};

export const initLancetSectionScroll = () =>
  initOnLoad(() => {
    setupSectionScroll();

    if (isListeningForLayoutChange) return;
    isListeningForLayoutChange = true;

    window.addEventListener("layoutchange", () => {
      requestAnimationFrame(setupSectionScroll);
    });
  });

import "./style.css";

import "./js/libraries/vue";
import "./js/libraries/yandex-metrika";
import "./js/libraries/swiper";
// import "./js/libraries/chart";

import { isHardwareAccelerationEnabled } from "./js/libraries/hw-detect";
import { onReady } from "./js/utils/onReady";

import { applyInitialTheme, initThemeToggle } from "./js/custom/theme-toggle";
import { initLocaleToggle } from "./js/custom/locale-toggler";
import { initScrollSection } from "./js/custom/scroll-section";
import { initSections } from "./js/custom/sections";
import { initScrollToTop } from "./js/custom/scroll-to-top";
import { initMenuDotToggler } from "./js/custom/menu-dot-toggler";
import { initHeroBgCells } from "./js/custom/hero-bg-cells";
import { initDesignActive } from "./js/custom/design-active";
import { initRandomCounter } from "./js/custom/random-counter";

const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hwOn = isHardwareAccelerationEnabled() && !prefersReduce;
const screenLg = window.innerWidth >= 1024;

applyInitialTheme();
initThemeToggle();
initLocaleToggle();
initScrollSection();
initSections();
initScrollToTop();
initMenuDotToggler();
initHeroBgCells();
initDesignActive();
initRandomCounter();

if (!hwOn) {
  document.documentElement.classList.add("no-hw");
}

(async () => {
  try {
    if (hwOn) {
      const imports = [import("./js/libraries/model-viewer").then(({ ensureModelViewerLoaded }) => ensureModelViewerLoaded()), import("./js/libraries/lenis").then(() => import("./js/custom/progress-bar").then(({ initProgressBar }) => initProgressBar())), import("./js/custom/parallax").then(({ initParallax }) => initParallax())];

      if (screenLg) {
        imports.push(
          import("./js/libraries/vanilla-tilt").then(({ initVanillaTilt }) => onReady(initVanillaTilt)),
          import("./js/custom/cursor").then(({ initCursor }) => onReady(initCursor)),
          import("./js/custom/horizontal-scroll").then(({ initHorizontalScroll }) => initHorizontalScroll()),
        );
      }

      await Promise.all(imports);
    } else {
      await import("./styles/no-hw.css");
    }
  } catch (e) {
    console.error("Failed to load dynamic modules:", e);
  }
})();

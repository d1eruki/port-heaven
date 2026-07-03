import "./style.css";

import "./js/libraries/vue";
import "./js/libraries/yandex-metrika";

import { applyHwClass } from "./js/libraries/hw-detect";
import { onReady } from "./js/utils/onReady";
import { isViewportAtLeast } from "./js/utils/breakpoints";

import { applyInitialTheme } from "./js/features/preferences/theme-toggle";
import { initSections } from "./js/features/navigation/sections";
import { initScrollToTop } from "./js/features/navigation/scroll-to-top";
import { initMenuDotToggler } from "./js/features/navigation/menu-dot-toggler";
import { initHeroBgCells } from "./js/features/effects/hero-bg-cells";
import { initDesignActive } from "./js/features/effects/design-active";
import { initOdometerCounter } from "./js/features/effects/odometer-counter";

const hwOn = applyHwClass();
const screenLg = isViewportAtLeast("lg");

applyInitialTheme();
initSections();
initScrollToTop();
initMenuDotToggler();
initHeroBgCells();
initDesignActive();
initOdometerCounter();

(async () => {
  try {
    if (hwOn) {
      const lenisReady = import("./js/libraries/lenis");
      const imports = [
        lenisReady.then(() =>
          import("./js/features/navigation/progress-bar").then(({ initProgressBar }) =>
            initProgressBar(),
          ),
        ),
        lenisReady.then(() =>
          import("./js/features/effects/parallax").then(({ initParallax }) => initParallax()),
        ),
      ];

      if (screenLg) {
        imports.push(
          import("./js/libraries/vanilla-tilt").then(({ initVanillaTilt }) =>
            onReady(initVanillaTilt),
          ),
          import("./js/features/effects/cursor").then(({ initCursor }) => onReady(initCursor)),
          lenisReady.then(() =>
            import("./js/features/navigation/horizontal-scroll").then(({ initHorizontalScroll }) =>
              initHorizontalScroll(),
            ),
          ),
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

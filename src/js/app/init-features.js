import { applyHwClass } from "../libraries/hw-detect";
import { onReady } from "../utils/onReady";
import { isViewportAtLeast } from "../utils/breakpoints";

import { applyInitialTheme } from "../features/preferences/theme-toggle";
import { initSections } from "../features/navigation/sections";
import { initScrollToTop } from "../features/navigation/scroll-to-top";
import { initMenuDotToggler } from "../features/navigation/menu-dot-toggler";
import { initHeroBgCells } from "../features/effects/hero-bg-cells";
import { initDesignActive } from "../features/effects/design-active";
import { initOdometerCounter } from "../features/effects/odometer-counter";

export const initFeatures = async () => {
  const hwOn = applyHwClass();
  const screenLg = isViewportAtLeast("lg");

  applyInitialTheme();
  initSections();
  initScrollToTop();
  initMenuDotToggler();
  initHeroBgCells();
  initDesignActive();
  initOdometerCounter();

  try {
    if (hwOn) {
      const lenisReady = import("../libraries/lenis");
      const imports = [
        lenisReady.then(() =>
          import("../features/navigation/progress-bar").then(({ initProgressBar }) =>
            initProgressBar(),
          ),
        ),
        lenisReady.then(() =>
          import("../features/effects/parallax").then(({ initParallax }) => initParallax()),
        ),
      ];

      if (screenLg) {
        imports.push(
          import("../libraries/vanilla-tilt").then(({ initVanillaTilt }) =>
            onReady(initVanillaTilt),
          ),
          import("../features/effects/cursor").then(({ initCursor }) => onReady(initCursor)),
          lenisReady.then(() =>
            import("../features/navigation/horizontal-scroll").then(({ initHorizontalScroll }) =>
              initHorizontalScroll(),
            ),
          ),
        );
      }

      await Promise.all(imports);
    } else {
      await import("../../styles/no-hw.css");
    }
  } catch (e) {
    console.error("Failed to load dynamic modules:", e);
  }
};

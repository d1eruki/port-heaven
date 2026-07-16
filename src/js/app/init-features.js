import { applyHwClass } from "../libraries/hw-detect";
import { onReady } from "../utils/onReady";
import { isViewportAtLeast } from "../utils/breakpoints";

import { applyEffectsMode } from "../features/preferences/effects-toggle";
import { initSections } from "../features/navigation/sections";
import { initScrollToTop } from "../features/navigation/scroll-to-top";
import { initScrollRestoration } from "../features/navigation/scroll-restoration";
import { initMenuDotToggler } from "../features/navigation/menu-dot-toggler";
import { initDesignActive } from "../features/effects/design-active";
import { initOdometerCounter } from "../features/effects/odometer-counter";

export const initFeatures = async () => {
  const capabilities = applyHwClass();
  const { effectsOn } = applyEffectsMode(capabilities);
  const screenLg = isViewportAtLeast("lg");

  initSections();
  initScrollToTop();
  initScrollRestoration();
  initMenuDotToggler();
  try {
    if (effectsOn) {
      initDesignActive();
      initOdometerCounter();

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
        lenisReady.then(() =>
          import("../features/navigation/horizontal-scroll").then(({ initHorizontalScroll }) =>
            initHorizontalScroll(),
          ),
        ),
      ];

      if (screenLg) {
        imports.push(
          import("../libraries/vanilla-tilt").then(({ initVanillaTilt }) =>
            onReady(initVanillaTilt),
          ),
          import("../features/effects/cursor").then(({ initCursor }) => onReady(initCursor)),
        );
      }

      await Promise.all(imports);
    } else {
      await import("../../styles/no-effects.css");
    }
  } catch (e) {
    console.error("Failed to load dynamic modules:", e);
  }
};

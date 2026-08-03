import { detectEffectCapabilities } from "../libraries/effect-capabilities";
import { initScrollSmoother, ScrollTrigger } from "../libraries/gsap-scroll";
import { onReady } from "../utils/onReady";
import { isViewportAtLeast } from "../utils/breakpoints";

import { applyEffectsMode } from "../features/preferences/effects-toggle";
import { initSections } from "../features/navigation/sections";
import { initScrollToTop } from "../features/navigation/scroll-to-top";
import { initMenuDotToggler } from "../features/navigation/menu-dot-toggler";
import { initCreativeHeadingPin } from "../features/navigation/creative-heading-pin";
import { initProjectPin } from "../features/navigation/project-pin";
import { initAboutReveal } from "../features/effects/about-reveal";
import { initDesignActive } from "../features/effects/design-active";

export const initFeatures = async () => {
  const capabilities = detectEffectCapabilities();
  const { effectsOn } = applyEffectsMode(capabilities);
  const screenLg = isViewportAtLeast("lg");

  if (effectsOn) initScrollSmoother();

  initSections();
  initScrollToTop();
  initMenuDotToggler();
  initProjectPin();
  initCreativeHeadingPin();

  try {
    if (effectsOn) {
      initAboutReveal();
      initDesignActive();

      const desktopModules = screenLg
        ? Promise.all([import("../libraries/vanilla-tilt"), import("../features/effects/cursor")])
        : null;
      const [{ initHorizontalScroll }, { initProgressBar }, { initSectionSnap }] =
        await Promise.all([
          import("../features/navigation/horizontal-scroll"),
          import("../features/navigation/progress-bar"),
          import("../features/navigation/section-snap"),
        ]);

      initHorizontalScroll();
      initProgressBar();
      initSectionSnap();

      if (desktopModules) {
        const [{ initVanillaTilt }, { initCursor }] = await desktopModules;
        onReady(initVanillaTilt);
        onReady(initCursor);
      }
    } else {
      await import("../../styles/no-effects.css");
    }
  } catch (e) {
    console.error("Failed to load dynamic modules:", e);
  }

  ScrollTrigger.refresh();
};

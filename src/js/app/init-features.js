import { detectEffectCapabilities } from "../libraries/effect-capabilities";
import { initScrollSmoother, ScrollTrigger, gsap } from "../libraries/gsap-scroll";
import { onReady } from "../utils/on-ready";
import { getBreakpointPx } from "../utils/breakpoints";

import { applyEffectsMode } from "../features/preferences/effects-toggle";
import {
  captureEffectsScrollPosition,
  hasPendingEffectsScrollPosition,
  restoreEffectsScrollPosition,
} from "../features/preferences/effects-scroll-restoration";
import { initSections } from "../features/navigation/sections";
import { initScrollToTop } from "../features/navigation/scroll-to-top";
import { initMenuDotToggler } from "../features/navigation/menu-dot-toggler";
import { initCreativeHeadingPin } from "../features/navigation/creative-heading-pin";
import { initProjectPin } from "../features/navigation/project-pin";
import { initAboutReveal } from "../features/effects/about-reveal";
import { initDesignActive } from "../features/effects/design-active";

const enableNativeScrollRestoration = () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = hasPendingEffectsScrollPosition() ? "manual" : "auto";
  }
};

const preserveScrollPosition = () => {
  captureEffectsScrollPosition();
  enableNativeScrollRestoration();
};

const runFeature = async (name, load, initialize) => {
  try {
    return await initialize(await load());
  } catch (error) {
    console.error(`Failed to initialize ${name}:`, error);
  }
};

const initDesktopEffects = () => {
  const media = gsap.matchMedia();
  media.add({
    desktop: `(min-width: ${getBreakpointPx("lg")}px)`,
    finePointer: "(pointer: fine)",
  }, ({ conditions }) => {
    if (!conditions.desktop) return;
    let disposed = false;
    const cleanups = [];
    const activate = (initialize) => (module) => {
      if (disposed) return;
      const cleanup = initialize(module);
      if (typeof cleanup === "function") cleanups.push(cleanup);
    };

    void runFeature("card tilt", () => import("../libraries/vanilla-tilt"),
      activate((module) => module.initVanillaTilt()));
    if (conditions.finePointer) {
      void runFeature("cursor", () => import("../features/effects/cursor"),
        activate((module) => module.initCursor()));
    }
    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  });
  if (import.meta.hot) import.meta.hot.dispose(() => media.revert());
};

export const initFeatures = async () => {
  enableNativeScrollRestoration();
  window.addEventListener("pagehide", preserveScrollPosition);

  const capabilities = detectEffectCapabilities();
  const { effectsOn } = applyEffectsMode(capabilities);

  if (effectsOn) initScrollSmoother();

  initSections();
  initScrollToTop();
  initMenuDotToggler();
  initProjectPin();
  initCreativeHeadingPin();

  if (effectsOn) {
    initDesktopEffects();
    await Promise.all([
      runFeature("about reveal", () => ({}), () => initAboutReveal()),
      runFeature("active design", () => ({}), () => initDesignActive()),
      runFeature("creative parallax", () => import("../features/effects/creative-parallax"),
        (module) => onReady(module.initCreativeParallax)),
      runFeature("horizontal scroll", () => import("../features/navigation/horizontal-scroll"),
        (module) => module.initHorizontalScroll()),
      runFeature("progress bar", () => import("../features/navigation/progress-bar"),
        (module) => module.initProgressBar()),
      runFeature("section snap", () => import("../features/navigation/section-snap"),
        (module) => module.initSectionSnap()),
      runFeature("reviews", () => import("../features/effects/reviews"),
        (module) => onReady(module.initReviews)),
    ]);
  } else {
    await runFeature("no-effects styles", () => import("../../styles/no-effects.css"), () => {});
  }

  ScrollTrigger.refresh();
  await restoreEffectsScrollPosition();
};

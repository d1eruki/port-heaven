import "./style.css";

import "./js/libraries/vue";
import "./js/libraries/yandex-metrika";
import "./js/libraries/swiper";
// import "./js/libraries/chart";

import { isHardwareAccelerationEnabled } from "./js/libraries/hw-detect";

import "./js/custom/theme-toggle";
import "./js/custom/locale-toggler";
import "./js/custom/scroll-section";
import "./js/custom/sections";
import "./js/custom/scroll-to-top";
import "./js/custom/menu-dot-toggler";
import "./js/custom/hero-bg-cells";
import "./js/custom/prevent-orphans";
import "./js/custom/design-active";
import "./js/custom/random-counter";

const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hwOn = isHardwareAccelerationEnabled() && !prefersReduce;
const screenLg = window.innerWidth >= 1024;

if (!hwOn) {
  document.documentElement.classList.add("no-hw");
}

(async () => {
  try {
    if (hwOn) {
      const imports = [import("./js/libraries/model-viewer").then(({ ensureModelViewerLoaded }) => ensureModelViewerLoaded())];

      if (screenLg) {
        imports.push(
          import("./js/libraries/lenis"),
          import("./js/libraries/vanilla-tilt"),
          import("./js/custom/hero-image-effect"),
          import("./js/custom/cursor"),
          import("./js/custom/scroll-speed"),
          import("./js/custom/horizontal-scroll")
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

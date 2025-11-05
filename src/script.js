import "./style.css";

import "./js/libraries/vue";
import "./js/libraries/yandex-metrika";
import { isHardwareAccelerationEnabled } from "./js/libraries/hw-detect";

import "./js/custom/theme-toggle";
import "./js/custom/locale-toggler";
import "./js/custom/cursor";
import "./js/custom/scroll-section";
import "./js/custom/sections";
import "./js/custom/scroll-to-top";
import "./js/custom/header-toggle";
import "./js/custom/bg-cells";
import "./js/custom/prevent-orphans";

// Conditionally load smooth scroll and hero image scale only if HW acceleration is available
(async () => {
  try {
    if (isHardwareAccelerationEnabled()) {
      await import("./js/libraries/lenis");
      await import("./js/libraries/vanilla-tilt");
      await import("./js/custom/hero-image-scale");
    }
  } catch {
    // ignore
  }
})();

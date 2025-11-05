import "./style.css";

import "./js/libraries/vue";
import "./js/libraries/yandex-metrika";
import { isHardwareAccelerationEnabled } from "./js/libraries/hw-detect";

import "./js/custom/theme-toggle";
import "./js/custom/locale-toggler";
import "./js/custom/scroll-section";
import "./js/custom/sections";
import "./js/custom/scroll-to-top";
import "./js/custom/header-toggle";
import "./js/custom/bg-cells";
import "./js/custom/prevent-orphans";

const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hwOn = isHardwareAccelerationEnabled() && !prefersReduce;

if (!hwOn) {
  document.documentElement.classList.add("no-hw");
}

(async () => {
  try {
    if (hwOn) {
      await import("./js/libraries/lenis");
      await import("./js/libraries/vanilla-tilt");
      await import("./js/custom/hero-image-scale");
      await import("./js/custom/hero-image-parallax");
      await import("./js/custom/cursor");
    } else {
      await import("./styles/no-hm.css");
    }
  } catch {}
})();

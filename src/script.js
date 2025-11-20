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

const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hwOn = isHardwareAccelerationEnabled() && !prefersReduce;
const screenLg = window.innerWidth >= 1024;

if (!hwOn) {
  document.documentElement.classList.add("no-hw");
}

(async () => {
  try {
    if (hwOn && screenLg) {
      await import("./js/libraries/lenis");
      await import("./js/libraries/vanilla-tilt");
      await import("./js/custom/hero-image-scale");
      await import("./js/custom/hero-image-parallax");
      await import("./js/custom/cursor");
    } else if (!hwOn) {
      await import("./styles/no-hw.css");
    }
  } catch {}
})();

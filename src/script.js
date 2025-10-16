import "./style.css";
import "./js/vue";
import "./js/yandex-metrika";

import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/card-rotate";
import "./js/cursor";

import "./js/scroll-section";

import { updateProgressBar } from "./js/progress-bar";

const LG_BREAKPOINT = 1024;

if (window.innerWidth >= LG_BREAKPOINT) {
  import("./js/gsap").catch(() => {});
}

window.onscroll = updateProgressBar;

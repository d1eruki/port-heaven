import "./style.css";
import "./js/vue";
import "./js/gsap";

import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/yandex-metrika";
import "./js/card-rotate";
import "./js/cursor";

//import "./js/gsap/scroll-card";

//import "./js/scroll";
//import "./js/scroll-to-top";

import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

import "./style.css";
import "./js/vue";
import "./js/yandex-metrika";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/card-rotate";
import "./js/cursor";
import "./js/scroll-section";
//import "./js/sections";
import "./js/lenis";

import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

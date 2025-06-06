import "./style.scss";
import "./js/vue";
import "./js/menu-swap";
import "./js/scroll-to-section";
import "./js/scroll-to-top";
import "./js/draw-elements";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/banner-offset";
import "./js/marquee";
import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

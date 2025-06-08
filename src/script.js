import "./style.scss";
import "./js/vue";
import "./js/scroll-to-section";
import "./js/scroll-to-top";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

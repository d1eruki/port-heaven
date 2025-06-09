import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

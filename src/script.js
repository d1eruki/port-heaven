import "./style.scss";
import "./js/vue";
import "./js/change-logo";
import "./js/menu-swap";
import "./js/scroll-to-section";
import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

import "./style.scss";
import "./js/menu-swap";
import "./js/vue";
import "./js/scroll-to-section";
import { updateProgressBar } from "./js/progress-bar";
import { generateChessboard } from "./js/chessboard";
import { updateHeaderOnScroll } from "./js/scroll-header";

window.onscroll = updateProgressBar;
generateChessboard();
updateHeaderOnScroll();

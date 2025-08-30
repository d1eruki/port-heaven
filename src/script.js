import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/section-height";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import "./js/yandex-metrika";
import "./js/swipers";
import { updateProgressBar } from "./js/progress-bar";
import MicroModal from "micromodal";

MicroModal.init({
  disableScroll: true,
  disableFocus: true,
});

window.onscroll = updateProgressBar;

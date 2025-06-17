import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import "./js/section-height";
import { updateProgressBar } from "./js/progress-bar";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

window.onscroll = updateProgressBar;

const swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

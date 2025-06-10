import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import { updateProgressBar } from "./js/progress-bar";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

window.onscroll = updateProgressBar;

new Swiper(".mySwiper", {
  direction: "horizontal",
  slidesPerView: 1,
  mousewheel: true,
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
});

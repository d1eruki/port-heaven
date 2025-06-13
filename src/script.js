import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import "./js/header-background";
import { updateProgressBar } from "./js/progress-bar";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

window.onscroll = updateProgressBar;

new Swiper(".mySwiper", {
  direction: "horizontal",
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 20000,
    disableOnInteraction: false,
  },
});

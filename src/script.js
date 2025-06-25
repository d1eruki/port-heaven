import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/section-height";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import "./js/yandex-metrika";
import { updateProgressBar } from "./js/progress-bar";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import MicroModal from "micromodal";

MicroModal.init({
  disableScroll: true,
  disableFocus: true,
});

window.onscroll = updateProgressBar;

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 3,
    },
  },
});

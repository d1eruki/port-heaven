import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/section-height";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/marquee";
import { updateProgressBar } from "./js/progress-bar";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import MicroModal from "micromodal";

window.onscroll = updateProgressBar;

const swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    slidesPerView: 1,
  },
});

MicroModal.init({
  disableScroll: true,
});

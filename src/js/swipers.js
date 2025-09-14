import Swiper from "swiper";
import { Pagination } from "swiper/modules";
import "swiper/css/bundle";

const swiper1 = new Swiper(".swiper1", {
  modules: [Pagination],
  slidesPerView: 1,
  pagination: {
    el: ".swiper1 .swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 3,
    },
  },
});

const swiper2 = new Swiper(".swiper2", {
  modules: [Pagination],
  slidesPerView: 1,
  pagination: {
    el: ".swiper2 .swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 3,
    },
  },
});

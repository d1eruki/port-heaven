import Swiper from "swiper";
import "swiper/css/bundle";


const swiper1 = new Swiper(".swiper1", {
  slidesPerView: 1,
  pagination: {
    el: ".swiper1-pagination",
    clickable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 3,
    },
  },
});

const swiper2 = new Swiper(".swiper2", {
  slidesPerView: 1,
  pagination: {
    el: ".swiper2-pagination",
    clickable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 3,
    },
  },
});

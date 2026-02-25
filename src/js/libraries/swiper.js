import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
const swiper = new Swiper(".mySwiper", {
  modules: [Navigation, Pagination],
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
});

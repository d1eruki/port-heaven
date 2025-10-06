import "./style.scss";
import "./js/vue";
import "./js/scroll";
import "./js/scroll-to-top";
import "./js/theme-toggle";
import "./js/locale-toggler";
import "./js/yandex-metrika";
import "./js/card-rotate";
import "./js/cursor";

// Centralized GSAP imports and plugin registration
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// expose globally so feature modules can reference without re-importing
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollSmoother = ScrollSmoother;

// Feature modules (they will reference window.gsap/plugins at runtime)
import "./js/gsap/scroll-card";

//import "./js/section-height";
import { updateProgressBar } from "./js/progress-bar";

window.onscroll = updateProgressBar;

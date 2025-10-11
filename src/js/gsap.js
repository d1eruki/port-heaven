// gsap + plugins
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// для дебага в консоли
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollSmoother = ScrollSmoother;

// 1) Smoother
const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,
  effects: true,
  smoothTouch: 0.1
});

// 2) Первый пин — header
const pinHeader = ScrollTrigger.create({
  trigger: "header",
  start: "top top",
  end: "9999999",
  pin: true,
  pinSpacing: false,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  // markers: true
});

// 2.1) Второй пин — пометь элемент в разметке атрибутом data-pin (или замени селектор на свой)
const pinHeadings = ScrollTrigger.create({
  trigger: "#projects .pin",
  start: "top top",
  endTrigger: "#projects",
  end: "bottom top",
  pin: true,
  pinSpacing: true,            // для контентных блоков обычно оставляем отступ
  anticipatePin: 1,
  invalidateOnRefresh: true,
  // markers: true
});

// 3) Отключить эффекты smoother на пин-элементах
smoother.effects(pinHeader.pin,  { speed: 0 });
smoother.effects(pinHeadings.pin, { speed: 0 });

// 4) Обновить расчёты
window.addEventListener("load", () => ScrollTrigger.refresh());

// для наглядности
console.log("Pinned elements:", { header: pinHeader.pin, second: pinHeadings.pin });

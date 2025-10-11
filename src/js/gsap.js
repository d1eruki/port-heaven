import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollSmoother = ScrollSmoother;

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,
  effects: true,
  smoothTouch: 0.1,
});

const pinHeader = ScrollTrigger.create({
  trigger: "header",
  start: "top top",
  endTrigger: "body",
  end: "bottom top",
  pin: true,
  pinSpacing: false,
  invalidateOnRefresh: true,
});

const pinHeadings = ScrollTrigger.create({
  trigger: "#projects .pin",
  start: "top top",
  endTrigger: "#projects",
  end: "bottom top",
  pin: true,
  pinSpacing: false,
  invalidateOnRefresh: true,
});

const cards = gsap.utils.toArray(".project");
cards.forEach((card, index) => {
  ScrollTrigger.create({
    trigger: card,
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: true,
    invalidateOnRefresh: true,
  });
});

smoother.effects(pinHeader.pin, { speed: 0 });
smoother.effects(pinHeadings.pin, { speed: 0 });

window.addEventListener("load", () => ScrollTrigger.refresh());

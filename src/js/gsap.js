import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

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
  anticipatePin: 1,
  invalidateOnRefresh: true,
});

gsap.utils.toArray("section .pin").forEach((el) => {
  const section = el.closest("section");
  const st = ScrollTrigger.create({
    trigger: el,
    start: "top top",
    endTrigger: section,
    end: "bottom top",
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    pinnedContainer: "#smooth-content",
  });
  if (st.pin) smoother.effects(st.pin, { speed: 0 });
});

gsap.utils.toArray(".project").forEach((el, i) => {
  const st = ScrollTrigger.create({
    trigger: el,
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });
  if (st.pin) smoother.effects(st.pin, { speed: 0 });
});

if (pinHeader.pin) smoother.effects(pinHeader.pin, { speed: 0 });

window.addEventListener("load", () => ScrollTrigger.refresh());

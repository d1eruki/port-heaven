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

gsap.utils.toArray("section .pin").forEach((element) => {
  const section = element.closest("section");

  ScrollTrigger.create({
    trigger: element,
    start: "top top",
    endTrigger: section,
    end: "bottom top",
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    pinnedContainer: "#smooth-content",
  });
});

gsap.utils.toArray(".project").forEach((element) => {
  const st = ScrollTrigger.create({
    trigger: element,
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });
});

const container = document.querySelector("#creatives .container-creatives");

gsap.to(container, {
  y: () => -(container.scrollHeight - window.innerHeight),
  ease: "none",
  scrollTrigger: {
    trigger: container,
    start: "top top",
    end: () => `+=${container.scrollHeight - window.innerHeight}`,
    scrub: true,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    pinnedContainer: "#smooth-content",
  },
});

if (pinHeader.pin) smoother.effects(pinHeader.pin, { speed: 0 });

window.addEventListener("load", () => ScrollTrigger.refresh());

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initOnLoad } from "../../utils/scroll";

gsap.registerPlugin(ScrollTrigger);

let triggers = [];
let isListeningForLayoutChange = false;

const isLancet = () => document.documentElement.getAttribute("data-variant") === "lancet";

const clearScrollCards = () => {
  triggers.forEach((trigger) => trigger.kill());
  triggers = [];
};

const initScroll = (section, projects, direction) => {
  projects.forEach((project, index) => {
    if (index !== 0) {
      if (direction === "horizontal") {
        gsap.set(project, { xPercent: 100 });
      } else {
        gsap.set(project, { yPercent: 100 });
      }
    } else {
      gsap.set(project, { xPercent: 0, yPercent: 0 });
    }
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      anticipatePin: 1,
      start: "top top",
      end: () => `+=${projects.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });

  projects.forEach((project, index) => {
    timeline.to(project, {});

    const next = projects[index + 1];
    if (!next) return;

    timeline.set(next, { zIndex: index + 2 }, "<");

    if (direction === "horizontal") {
      timeline.to(next, { xPercent: 0 }, "<");
    } else {
      timeline.to(next, { yPercent: 0 }, "<");
    }
  });

  if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
};

const setupScrollCards = () => {
  clearScrollCards();
  if (!isLancet()) return;

  const scrollSections = document.querySelectorAll(".lancet-shell .scroll-section");

  scrollSections.forEach((section) => {
    const wrapper = section.querySelector(".wrapper");
    if (!wrapper) return;

    const projects = wrapper.querySelectorAll(".project");
    if (!projects.length) return;

    let direction = null;

    if (section.classList.contains("vertical-section")) {
      direction = "vertical";
    } else if (section.classList.contains("horizontal-section")) {
      direction = "horizontal";
    }

    initScroll(section, projects, direction);
  });

  ScrollTrigger.refresh();
};

export const initLancetScrollCard = () =>
  initOnLoad(() => {
    setupScrollCards();

    if (!isListeningForLayoutChange) {
      isListeningForLayoutChange = true;

      window.addEventListener("layoutchange", () => {
        requestAnimationFrame(setupScrollCards);
      });
      window.addEventListener("orientationchange", () => ScrollTrigger.refresh());
      window.addEventListener("resize", () => ScrollTrigger.refresh());
    }
  });

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";
import { LANCET_VARIANT } from "../../variants/registry";

gsap.registerPlugin(ScrollTrigger);

let triggers = [];

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
  onVariantLayoutReady({
    variants: LANCET_VARIANT,
    setup: () => {
      setupScrollCards();
      const refresh = () => ScrollTrigger.refresh();

      window.addEventListener("orientationchange", refresh);
      window.addEventListener("resize", refresh);

      return () => {
        window.removeEventListener("orientationchange", refresh);
        window.removeEventListener("resize", refresh);
      };
    },
    cleanup: clearScrollCards,
  });

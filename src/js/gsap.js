// GSAP + ScrollTrigger setup using ES modules for reliability
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Select the HTML elements needed for the animation
const scrollSection = document.querySelectorAll(".scroll-section");

scrollSection.forEach((section) => {
  const wrapper = section.querySelector(".wrapper");
  if (!wrapper) return;
  const items = wrapper.querySelectorAll(".item");
  if (!items || items.length === 0) return;

  // Initialize
  let direction = null;

  if (section.classList.contains("vertical-section")) {
    direction = "vertical";
  } else if (section.classList.contains("horizontal-section")) {
    direction = "horizontal";
  }

  initScroll(section, items, direction);
});

function initScroll(section, items, direction) {
  // Ensure stacking context so cards can overlap
  gsap.set(section.querySelector(".wrapper"), { position: "relative" });
  // Initial states (position all but the first off-screen in the proper axis)
  items.forEach((item, index) => {
    // absolute stack so they can overlap
    gsap.set(item, { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" });

    if (index !== 0) {
      if (direction === "horizontal") {
        gsap.set(item, { xPercent: 100 });
      } else {
        gsap.set(item, { yPercent: 100 });
      }
    }
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
    defaults: { ease: "none" },
  });

  items.forEach((item, index) => {
    // Animate current card subtle scale/border to indicate transition
    timeline.to(item, {
      scale: 0.9,
      borderRadius: "10px",
    });

    // Only animate to the next item if it exists
    const next = items[index + 1];
    if (!next) return;

    // bring next above the current before sliding it in
    timeline.set(next, { zIndex: index + 2 }, "<");

    if (direction === "horizontal") {
      timeline.to(next, { xPercent: 0 }, "<");
    } else {
      timeline.to(next, { yPercent: 0 }, "<");
    }
  });
}

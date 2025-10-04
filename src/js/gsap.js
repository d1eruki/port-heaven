// GSAP + ScrollTrigger setup using ES modules for reliability
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Initialize after DOM is ready to avoid early initialization issues (common on mobile)
window.addEventListener("DOMContentLoaded", () => {
  // Touch/device detection to tweak pinning strategy for mobile browsers
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

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

    initScroll(section, items, direction, { isTouch });
  });

  // On orientation change or resize, refresh ScrollTrigger to recalc measurements
  window.addEventListener("orientationchange", () => ScrollTrigger.refresh());
  window.addEventListener("resize", () => ScrollTrigger.refresh());
});

function initScroll(section, items, direction, { isTouch }) {
  // Ensure stacking context so cards can overlap
  const wrapper = section.querySelector(".wrapper");
  gsap.set(wrapper, { position: "relative" });

  // Ensure each card fills the viewport height (mobile-safe). CSS will use svh/dvh, but we provide JS fallback.
  const setHeights = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    gsap.set([section, wrapper], { minHeight: vh });
    items.forEach((item) => gsap.set(item, { height: vh }));
  };
  setHeights();
  // Re-apply heights before ScrollTrigger refresh calculations
  ScrollTrigger.addEventListener("refreshInit", setHeights);

  // Initial states (position all but the first off-screen in the proper axis)
  items.forEach((item, index) => {
    // absolute stack so they can overlap
    gsap.set(item, { position: "absolute", top: 0, left: 0, width: "100%", willChange: "transform" });

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
      // Use transform-based pinning on touch devices to avoid iOS address bar/fixed-position glitches
      pinType: isTouch ? "transform" : "fixed",
      anticipatePin: 1,
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
    timeline.to(item, {});

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

// Use globally-registered GSAP and plugins (initialized in script.js)

// Initialize after DOM is ready to avoid early initialization issues (common on mobile)
window.addEventListener("DOMContentLoaded", () => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    console.warn("GSAP/ScrollTrigger not initialized. Ensure script.js registers plugins before DOMContentLoaded.");
    return;
  }

  // Touch/device detection to tweak pinning strategy for mobile browsers
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  // Select the HTML elements needed for the animation
  const scrollSection = document.querySelectorAll(".scroll-section");

  scrollSection.forEach((section) => {
    const wrapper = section.querySelector(".wrapper");
    if (!wrapper) return;
    const projects = wrapper.querySelectorAll(".project");
    if (!projects || projects.length === 0) return;

    // Initialize
    let direction = null;

    if (section.classList.contains("vertical-section")) {
      direction = "vertical";
    } else if (section.classList.contains("horizontal-section")) {
      direction = "horizontal";
    }

    initScroll(gsap, section, projects, direction, { isTouch });
  });

  // On orientation change or resize, refresh ScrollTrigger to recalc measurements
  window.addEventListener("orientationchange", () => ScrollTrigger.refresh());
  window.addEventListener("resize", () => ScrollTrigger.refresh());
});

function initScroll(gsap, section, projects, direction, { isTouch }) {
  // Initial states (position all but the first off-screen in the proper axis)
  projects.forEach((project, index) => {
    // projects are stacked via CSS (absolute positioning) in style.scss

    if (index !== 0) {
      if (direction === "horizontal") {
        gsap.set(project, { xPercent: 100 });
      } else {
        gsap.set(project, { yPercent: 100 });
      }
    }
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      // pinType не указываем вовсе
      anticipatePin: 1,
      start: "top top",
      end: () => `+=${projects.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
    defaults: { ease: "none" },
  });

  projects.forEach((project, index) => {
    // Animate current card subtle scale/border to indicate transition
    timeline.to(project, {});

    // Only animate to the next project if it exists
    const next = projects[index + 1];
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

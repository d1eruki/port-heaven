import VanillaTilt from "vanilla-tilt";

document.addEventListener("DOMContentLoaded", () => {
  const root = getComputedStyle(document.documentElement);
  const raw = root.getPropertyValue("--breakpoint-lg").trim() || "1024px";

  let breakpointLg;
  if (raw.endsWith("rem")) {
    const rem = parseFloat(raw);
    const base = parseFloat(getComputedStyle(document.documentElement).fontSize);
    breakpointLg = rem * base;
  } else {
    breakpointLg = parseFloat(raw);
  }

  if (window.innerWidth < breakpointLg) return;

  const cards = document.querySelectorAll(".vanilla-tilt-creatives");
  if (!cards.length) return;

  cards.forEach((card) => {
    VanillaTilt.init(card, {
      reverse: false,
      max: 10,
      speed: 800,
      perspective: 800,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      glare: true,
      "max-glare": 0.3,
      gyroscope: true,
      reset: true,
      transition: true,
      scale: 1.5,
    });
  });
});

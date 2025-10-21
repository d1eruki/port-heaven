import VanillaTilt from "vanilla-tilt";

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".vanilla-tilt");
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

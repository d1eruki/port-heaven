import VanillaTilt from "vanilla-tilt";

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card"); // Выбираем все .card
  if (cards.length) {
    cards.forEach((card) => {
      VanillaTilt.init(card, {
        reverse: false,
        max: 10,
        speed: 800,
        perspective: 800,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        glare: true,
        "max-glare": 0.3,
        "glare-prerender": false,
        gyroscope: true,
        reset: true,
        "reset-to-start": true,
        transition: true,
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }
});

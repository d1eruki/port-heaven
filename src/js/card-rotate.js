import VanillaTilt from "vanilla-tilt";

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card"); // Выбираем все .card
  if (cards.length) {
    cards.forEach((card) => {
      VanillaTilt.init(card, {
        speed: 1000,
        max: 10,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        transition: true,
        glare: true,
        "max-glare": 0.35,
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }
});

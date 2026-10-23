import VanillaTilt from "vanilla-tilt";

export function initVanillaTilt() {
  const cards = document.querySelectorAll(".vanilla-tilt-creatives");
  if (!cards.length) return;

  const cleanups = Array.from(cards, (card) => {
    if (card.vanillaTilt) return () => {};
    const originalStyles = ["transform", "transition", "will-change"].map((property) => [
      property, card.style.getPropertyValue(property), card.style.getPropertyPriority(property),
    ]);
    const existingGlare = new Set(card.querySelectorAll(".js-tilt-glare"));
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
    const instance = card.vanillaTilt;
    const glare = Array.from(card.querySelectorAll(".js-tilt-glare")).filter((node) => !existingGlare.has(node));
    return () => {
      instance?.destroy();
      glare.forEach((node) => node.remove());
      originalStyles.forEach(([property, value, priority]) => {
        if (value) card.style.setProperty(property, value, priority);
        else card.style.removeProperty(property);
      });
    };
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

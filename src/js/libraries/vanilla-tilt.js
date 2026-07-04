import VanillaTilt from "vanilla-tilt";
import { VARIANT_FEATURES } from "../variants/registry";
import { onVariantLayoutReady } from "../features/preferences/variant-lifecycle";

const setupVanillaTilt = () => {
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

  return () => {
    cards.forEach((card) => {
      card.vanillaTilt?.destroy?.();
    });
  };
};

export function initVanillaTilt() {
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.VANILLA_TILT,
    setup: setupVanillaTilt,
  });
}

import Odometer from "odometer";
import "odometer/themes/odometer-theme-default.css";

import { onReady } from "../../utils/onReady";

const initializedCounters = new WeakSet();

const createOdometer = (el, value) => {
  if (initializedCounters.has(el)) return;

  initializedCounters.add(el);

  const odometer = new Odometer({
    el,
    value: 0,
  });

  let hasRun = false;

  const updateCounter = () => {
    if (hasRun) return;

    odometer.update(value);
    hasRun = true;
  };

  if (!("IntersectionObserver" in window)) {
    updateCounter();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: [0, 0.9],
    },
  );

  observer.observe(el);
};

export const initRandomCounter = () => {
  onReady(() => {
    const counters = document.querySelectorAll(".counter");
    if (counters.length === 0) return;

    counters.forEach((counter) => {
      const targetNumber = parseInt(counter.dataset.target || "", 10) || 0;
      createOdometer(counter, targetNumber);
    });
  });
};

import { onReady } from "../../utils/onReady";

const initializedCounters = new WeakSet();
let odometerPromise = null;

const loadOdometer = () => {
  odometerPromise ??= Promise.all([
    import("odometer"),
    import("odometer/themes/odometer-theme-default.css"),
  ]).then(([{ default: Odometer }]) => Odometer);

  return odometerPromise;
};

const createOdometer = (el, value, Odometer) => {
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

export const initOdometerCounter = () => {
  onReady(async () => {
    const counters = document.querySelectorAll(".counter");
    if (counters.length === 0) return;

    const Odometer = await loadOdometer();

    counters.forEach((counter) => {
      const targetNumber = parseInt(counter.dataset.target || "", 10) || 0;
      createOdometer(counter, targetNumber, Odometer);
    });
  });
};

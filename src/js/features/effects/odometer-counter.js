import { onReady } from "../../utils/onReady";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

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
  if (initializedCounters.has(el)) return null;

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
    return null;
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

  return () => {
    observer.disconnect();
  };
};

export const initOdometerCounter = () => {
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.ODOMETER_COUNTER,
    setup: () => {
      let cancelled = false;
      const cleanups = [];

      onReady(async () => {
        const counters = document.querySelectorAll(".counter");
        if (counters.length === 0 || cancelled) return;

        const Odometer = await loadOdometer();
        if (cancelled) return;

        counters.forEach((counter) => {
          const targetNumber = parseInt(counter.dataset.target || "", 10) || 0;
          const cleanup = createOdometer(counter, targetNumber, Odometer);
          if (typeof cleanup === "function") cleanups.push(cleanup);
        });
      });

      return () => {
        cancelled = true;
        cleanups.forEach((cleanup) => cleanup());
      };
    },
  });
};

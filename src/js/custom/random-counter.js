import Odometer from "odometer";
import "odometer/themes/odometer-theme-default.css";

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");
  if (counters.length === 0) return;

  const createOdometer = (el, value) => {
    const odometer = new Odometer({
      el: el,
      value: 0,
    });

    let hasRun = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun) {
            odometer.update(value);
            hasRun = true;
          }
        });
      },
      {
        threshold: [0, 0.9],
      },
    );

    observer.observe(el);
  };

  counters.forEach((counter) => {
    const targetNumber = parseInt(counter.dataset.target || "", 10) || 0;
    createOdometer(counter, targetNumber);
  });
});

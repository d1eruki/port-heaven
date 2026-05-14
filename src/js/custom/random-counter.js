import { onReady } from "../utils/onReady";

export const initRandomCounter = () =>
  onReady(() => {
    const counters = document.querySelectorAll("#counter");
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const rawTarget = el.dataset.target || "";
            const targetNumber = parseInt(rawTarget) || 0;
            const suffix = rawTarget.replace(/[0-9]/g, "");

            animateRandomCounter(el, targetNumber, 1500, suffix);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.4,
      },
    );

    counters.forEach((counter) => observer.observe(counter));
  });

function animateRandomCounter(el, target, duration = 1500, suffix = "") {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const factor = 1 - progress;

    const randomValue = Math.floor(target + (Math.random() * 2 - 1) * factor * target * 0.2);

    el.textContent = (progress < 1 ? randomValue : target) + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

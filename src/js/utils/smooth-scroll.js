import { getScrollSmoother } from "../libraries/gsap-scroll";
import { effectsEnabled } from "../features/preferences/effects-toggle";

function normalizeTarget(target) {
  if (typeof target === "number") return Math.max(0, Math.round(target));
  if (target && typeof target.getBoundingClientRect === "function") {
    const smoother = getScrollSmoother();
    if (smoother) return Math.max(0, Math.round(smoother.offset(target, "top top")));

    const rect = target.getBoundingClientRect();
    return Math.max(0, Math.round(rect.top + window.scrollY));
  }
  return 0;
}

export function smoothScrollTo(target, opts = {}) {
  const { offset = 0 } = opts || {};
  const baseY = normalizeTarget(target);
  const y = Math.max(0, baseY - (offset | 0));

  const animate = effectsEnabled.value;
  const smoother = getScrollSmoother();

  if (smoother) {
    smoother.scrollTo(y, animate);
    return;
  }

  window.scrollTo({ top: y, left: 0, behavior: animate ? "smooth" : "instant" });
}

export function smoothScrollTop() {
  const animate = effectsEnabled.value;
  const smoother = getScrollSmoother();

  if (smoother) {
    smoother.scrollTo(0, animate);
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: animate ? "smooth" : "instant" });
}

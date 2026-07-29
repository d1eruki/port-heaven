import { getScrollSmoother } from "../libraries/gsap-scroll";

function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return false;
  }
}

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

  const reduce = prefersReducedMotion();
  const smoother = getScrollSmoother();

  if (smoother) {
    smoother.scrollTo(y, !reduce);
    return;
  }

  window.scrollTo({ top: y, left: 0, behavior: reduce ? "auto" : "smooth" });
}

export function smoothScrollTop() {
  const reduce = prefersReducedMotion();
  const smoother = getScrollSmoother();

  if (smoother) {
    smoother.scrollTo(0, !reduce);
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
}

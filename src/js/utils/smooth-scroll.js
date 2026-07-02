import { getScrollY, scrollToY } from "../libraries/scroll-instance";

function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return false;
  }
}

function normalizeTarget(target) {
  if (typeof target === "number") return Math.max(0, target | 0);
  if (target && typeof target.getBoundingClientRect === "function") {
    const rect = target.getBoundingClientRect();
    return Math.max(0, Math.round(rect.top + getScrollY()));
  }
  return 0;
}

export function smoothScrollTo(target, opts = {}) {
  const { offset = 0 } = opts || {};
  const baseY = normalizeTarget(target);
  const y = Math.max(0, baseY - (offset | 0));

  const reduce = prefersReducedMotion();
  scrollToY(y, { offset: 0, behavior: reduce ? "auto" : "smooth" });
}

export function smoothScrollTop() {
  const reduce = prefersReducedMotion();
  scrollToY(0, { offset: 0, behavior: reduce ? "auto" : "smooth" });
}

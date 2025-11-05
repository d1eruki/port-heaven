// Unified smooth scroll utility
// Uses Lenis when available; falls back to native smooth scroll respecting prefers-reduced-motion

function hasLenis() {
  return typeof window !== "undefined" && typeof window.lenis === "object" && window.lenis && typeof window.lenis.scrollTo === "function";
}

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
    return Math.max(0, Math.round(rect.top + window.pageYOffset));
  }
  return 0;
}

export function smoothScrollTo(target, opts = {}) {
  const { offset = 0 } = opts || {};
  const baseY = normalizeTarget(target);
  const y = Math.max(0, baseY - (offset | 0));

  if (hasLenis()) {
    // Let Lenis handle the easing
    window.lenis.scrollTo(y, { offset: 0 });
  } else {
    const reduce = prefersReducedMotion();
    try {
      window.scrollTo({ top: y, left: 0, behavior: reduce ? "auto" : "smooth" });
    } catch {
      window.scrollTo(0, y);
    }
  }
}

export function smoothScrollTop() {
  if (hasLenis()) {
    window.lenis.scrollTo(0, { offset: 0 });
  } else {
    const reduce = prefersReducedMotion();
    try {
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }
}

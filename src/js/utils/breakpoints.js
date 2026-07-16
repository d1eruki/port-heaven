/* global __TAILWIND_SCREENS__ */
const BREAKPOINT_PREFIX = "--breakpoint-";
const DEFAULT_BREAKPOINTS = __TAILWIND_SCREENS__ || {};

const getRoot = () => document.documentElement;

const parseCssLengthToPx = (value) => {
  const rawValue = String(value || "").trim();
  const parsed = Number.parseFloat(rawValue);
  if (!Number.isFinite(parsed)) return 0;

  if (rawValue.endsWith("rem")) {
    const rootFontSize = Number.parseFloat(getComputedStyle(getRoot()).fontSize) || 16;
    return parsed * rootFontSize;
  }

  if (rawValue.endsWith("px")) return parsed;

  return parsed;
};

export const getBreakpointPx = (name) => {
  const value =
    DEFAULT_BREAKPOINTS[name] ||
    getComputedStyle(getRoot()).getPropertyValue(`${BREAKPOINT_PREFIX}${name}`);

  return parseCssLengthToPx(value);
};

export const isViewportAtLeast = (name, width = window.innerWidth) =>
  width >= getBreakpointPx(name);

export const isViewportBelow = (name, width = window.innerWidth) => width < getBreakpointPx(name);

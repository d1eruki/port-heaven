import { getBreakpointPx } from "../../utils/breakpoints";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

const CELLS = { base: 4, sm: 5, md: 6, lg: 7, xl: 8 };

function pickCellCount(w) {
  if (w >= getBreakpointPx("xl")) return CELLS.xl;
  if (w >= getBreakpointPx("lg")) return CELLS.lg;
  if (w >= getBreakpointPx("md")) return CELLS.md;
  if (w >= getBreakpointPx("sm")) return CELLS.sm;
  return CELLS.base;
}

function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}

function updateGrid() {
  const w = window.innerWidth;
  const count = pickCellCount(w);
  const size = Math.floor(w / count);

  const root = document.documentElement;
  root.style.setProperty("--cell", `${size}px`);
  root.style.setProperty("--cell-count", count);
}

const setupHeroBgCells = () => {
  const onResize = debounce(updateGrid, 100);
  window.addEventListener("resize", onResize);
  updateGrid();

  return () => {
    window.removeEventListener("resize", onResize);
  };
};

export function initHeroBgCells() {
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.HERO_BG_CELLS,
    setup: setupHeroBgCells,
  });
}

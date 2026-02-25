const BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };
const CELLS = { base: 4, sm: 5, md: 6, lg: 7, xl: 8 };

function pickCellCount(w) {
  if (w >= BP.xl) return CELLS.xl;
  if (w >= BP.lg) return CELLS.lg;
  if (w >= BP.md) return CELLS.md;
  if (w >= BP.sm) return CELLS.sm;
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

window.addEventListener("resize", debounce(updateGrid, 100));
updateGrid();

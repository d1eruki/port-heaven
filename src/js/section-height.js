function applyHeights() {
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const minWidthPx = 64 * remInPx;
  const isMobile = window.innerWidth < minWidthPx;

  const elementsWithId = Array.from(document.body.children).filter((el) => el.id);

  if (elementsWithId.length < 2) return;

  const middleElements = elementsWithId.slice(1, -1);
  const lastEl = elementsWithId[elementsWithId.length - 1];

  if (isMobile) {
    middleElements.forEach((el) => (el.style.minHeight = ""));
    lastEl.style.minHeight = "";
    return;
  }

  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const screenHeight = window.innerHeight;

  middleElements.forEach((el) => {
    el.style.minHeight = screenHeight - headerHeight + "px";
  });

  lastEl.style.minHeight = screenHeight - headerHeight + "px";
}

window.addEventListener("DOMContentLoaded", applyHeights);
window.addEventListener("resize", applyHeights);

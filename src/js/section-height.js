function applyHeights() {
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const minWidthPx = 64 * remInPx;

  const elementsWithId = Array.from(document.body.children).filter(el => el.id);

  if (elementsWithId.length < 2) return;

  const middleElements = elementsWithId.slice(1, -1);
  const lastEl = elementsWithId[elementsWithId.length - 1];

  middleElements.forEach(el => {
    el.style.minHeight = (screenHeight - headerHeight) + "px";
  });

  if (screenWidth >= minWidthPx) {
    lastEl.style.minHeight = (screenHeight - headerHeight) + "px";
  } else {
    lastEl.style.minHeight = "";
  }
}

window.addEventListener("DOMContentLoaded", applyHeights);
window.addEventListener("resize", applyHeights);

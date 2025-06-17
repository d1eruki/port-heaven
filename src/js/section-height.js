function applyHeights() {
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const minWidthPx = 64 * remInPx;

  // Фильтруем: только прямые потомки body с id
  const elementsWithId = Array.from(document.body.children).filter((el) => el.id);

  if (elementsWithId.length < 2) return; // нечего обрабатывать

  const middleElements = elementsWithId.slice(1, -1);
  const lastEl = elementsWithId[elementsWithId.length - 1];

  // Растягиваем все, кроме первого и последнего
  middleElements.forEach((el) => {
    el.style.minHeight = screenHeight - headerHeight + "px";
    console.log(`→ Set minHeight for #${el.id}`);
  });

  // Последний — только если ширина >= 64rem
  if (screenWidth >= minWidthPx) {
    lastEl.style.minHeight = screenHeight - headerHeight + "px";
    console.log(`→ Set minHeight for LAST #${lastEl.id}`);
  } else {
    lastEl.style.minHeight = "";
    console.log(`→ CLEARED minHeight for LAST #${lastEl.id}`);
  }
}

window.addEventListener("DOMContentLoaded", applyHeights);
window.addEventListener("resize", applyHeights);

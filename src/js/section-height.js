import { getHeaderHeight } from "./global-variables";

function throttle(func, delay) {
  let timeoutId;
  return function (...args) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    }
  };
}

function applyHeights() {
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const minWidthPx = 64 * remInPx;
  const isMobile = window.innerWidth < minWidthPx;

  // 👇 Используем data-section вместо id
  const sectionElements = Array.from(document.querySelectorAll("[data-section]"));
  if (sectionElements.length < 2) return;

  const middleElements = sectionElements.slice(1, -1);
  const lastEl = sectionElements[sectionElements.length - 1];
  const header = document.querySelector("header");

  if (!header) return;

  // Сбрасываем высоту перед измерением
  header.style.height = "";

  if (isMobile) {
    middleElements.forEach((el) => {
      el.style.minHeight = "";
      el.style.paddingTop = "";
    });
    lastEl.style.minHeight = "";
    lastEl.style.paddingTop = "";
    return;
  }

  // Измеряем актуальную высоту хедера (fallback на getBoundingClientRect)
  const measuredHeaderHeight = Math.round(getHeaderHeight() || header.getBoundingClientRect().height || 0);
  const headerHeight = Math.max(0, measuredHeaderHeight);

  // Фиксируем высоту хедера, чтобы расчет секций был стабильным
  header.style.height = `${headerHeight}px`;

  const screenHeight = window.innerHeight;
  const targetHeight = Math.max(0, screenHeight - headerHeight);

  middleElements.forEach((el) => {
    // Не уменьшаем высоту секции снизу — оставляем стандартную min-height (например, min-h-dvh из классов)
    el.style.minHeight = "";
    // Отступ только сверху, чтобы контент не уезжал под фиксированный header
    el.style.paddingTop = `${headerHeight}px`;
  });

  // Убираем отступы на последней секции, чтобы не было пустого места снизу
  lastEl.style.minHeight = "";
  lastEl.style.paddingTop = "";
}

const throttledApplyHeights = throttle(() => requestAnimationFrame(applyHeights), 100);

// Перерасчет при различных событиях жизненного цикла страницы
window.addEventListener("DOMContentLoaded", () => {
  // Две итерации через rAF, чтобы дождаться верстки/шрифтов
  requestAnimationFrame(() => requestAnimationFrame(applyHeights));
});
window.addEventListener("load", applyHeights);
window.addEventListener("resize", throttledApplyHeights);

// Если поддерживается, пересчитываем после загрузки шрифтов
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => applyHeights()).catch(() => {});
}

// Отслеживаем изменения размера самого хедера (например, из‑за динамического контента)
(function observeHeaderResize() {
  const header = document.querySelector("header");
  if (!header || typeof ResizeObserver === "undefined") return;
  const ro = new ResizeObserver(throttledApplyHeights);
  ro.observe(header);
})();

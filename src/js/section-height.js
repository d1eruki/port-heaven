// Функция троттлинга
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
  console.log('remInPx:', remInPx);

  const minWidthPx = 64 * remInPx;
  const isMobile = window.innerWidth < minWidthPx;
  console.log('window.innerWidth:', window.innerWidth, 'minWidthPx:', minWidthPx, 'isMobile:', isMobile);

  const elementsWithId = Array.from(document.body.children).filter((el) => el.id);
  console.log('elementsWithId:', elementsWithId.length);

  if (elementsWithId.length < 2) {
    console.warn('Недостаточно элементов с id:', elementsWithId);
    return;
  }

  const middleElements = elementsWithId.slice(1, -1);
  const lastEl = elementsWithId[elementsWithId.length - 1];
  console.log('middleElements:', middleElements.length, 'lastEl:', lastEl.id);

  const header = document.querySelector("header");
  if (!header) {
    console.error('Header не найден!');
    return;
  }

  // Сбрасываем inline-стили header перед вычислением высоты
  header.style.height = '';

  if (isMobile) {
    console.log('Мобильный режим: сбрасываем minHeight и высоту header');
    middleElements.forEach((el) => (el.style.minHeight = ""));
    lastEl.style.minHeight = "";
    // В мобильном режиме не задаем высоту header, чтобы она зависела от контента
    console.log('Header content height:', header.offsetHeight);
    return;
  }

  // В десктопном режиме округляем высоту header
  const headerHeightRaw = header.offsetHeight;
  const headerHeight = Math.round(headerHeightRaw);
  header.style.height = headerHeight + "px"; // Устанавливаем целую высоту
  console.log('headerHeightRaw:', headerHeightRaw, 'headerHeight (rounded):', headerHeight);

  const screenHeight = window.innerHeight;
  console.log('screenHeight:', screenHeight);

  middleElements.forEach((el) => {
    const calculatedHeight = screenHeight - headerHeight;
    el.style.minHeight = calculatedHeight + "px";
    console.log(`Элемент ${el.id}: minHeight = ${calculatedHeight}px`);
  });

  const calculatedHeightLast = screenHeight - headerHeight;
  lastEl.style.minHeight = calculatedHeightLast + "px";
  console.log(`Последний элемент ${lastEl.id}: minHeight = ${calculatedHeightLast}px`);

  // Проверяем стили header
  const headerStyles = window.getComputedStyle(header);
  console.log('Header styles:', {
    height: headerStyles.height,
    paddingTop: headerStyles.paddingTop,
    paddingBottom: headerStyles.paddingBottom,
    lineHeight: headerStyles.lineHeight,
    fontSize: headerStyles.fontSize
  });
}

// Троттлируем функцию applyHeights (100 мс)
const throttledApplyHeights = throttle(applyHeights, 100);

window.addEventListener("DOMContentLoaded", applyHeights);
window.addEventListener("resize", throttledApplyHeights);

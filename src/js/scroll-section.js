document.addEventListener("DOMContentLoaded", () => {
  // --------- Мини-конфиг ---------
  const body = document.body;
  const ACTIVE_CLASS = (body.getAttribute("data-active-class") || "!text-white").trim();
  const THRESHOLD_FRACTION = Math.min(0.9, Math.max(0.05, Number(body.getAttribute("data-flip-threshold")) || 0.3)); // 0.05..0.9

  // --------- DOM ---------
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  if (!sections.length) return;

  const allNavButtons = Array.from(document.querySelectorAll("[data-scroll-target]"));
  const navByName = new Map();
  for (const btn of allNavButtons) {
    const sel = btn.getAttribute("data-scroll-target");
    const m = sel && sel.match(/\[data-section=['"]?([^'"\]]+)['"]?]/);
    const name = m ? m[1] : "";
    if (!name) continue;
    if (!navByName.has(name)) navByName.set(name, []);
    navByName.get(name).push(btn);
  }

  // --------- Геометрия секций ---------
  const meta = sections.map((el) => ({ el, name: el.getAttribute("data-section") || "", top: 0, bottom: 0 }));

  const recomputePositions = () => {
    for (const m of meta) {
      const rect = m.el.getBoundingClientRect();
      const top = Math.round(rect.top + window.scrollY);
      m.top = top;
      m.bottom = top + Math.round(m.el.offsetHeight || rect.height);
    }
  };
  recomputePositions();

  // --------- Активная секция ---------
  let lastActiveName = null;

  const currentIndex = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const threshold = vh * THRESHOLD_FRACTION;

    let idx = 0;
    for (let i = 0; i < meta.length; i++) {
      if (meta[i].top <= y + vh - threshold) idx = i;
      else break;
    }
    return idx;
  };

  const setActiveByIndex = (i) => {
    const m = meta[i];
    if (!m || m.name === lastActiveName) return;
    lastActiveName = m.name;

    // снять со всех
    for (const btn of allNavButtons) btn.classList.remove(ACTIVE_CLASS);
    // повесить на связанные
    const btns = navByName.get(m.name) || [];
    btns.forEach((b) => b.classList.add(ACTIVE_CLASS));
  };

  // --------- События ---------
  // Клик по навкнопкам: мгновенно прыгаем к секции, без smooth
  document.addEventListener("click", (e) => {
    const navButton = e.target.closest("[data-scroll-target]");
    if (!navButton) return;

    const sel = navButton.getAttribute("data-scroll-target");
    if (!sel) return;

    const targetSection = document.querySelector(sel);
    if (!targetSection) return;

    e.preventDefault();

    // найти индекс и прыгнуть
    const i = meta.findIndex((m) => m.el === targetSection);
    if (i >= 0) {
      window.scrollTo(0, meta[i].top); // без плавности
      setActiveByIndex(i);
    }
  });

  // Обновляем подсветку при ручном скролле пользователем
  let scrollTimer = null;
  const onScrollThrottled = () => {
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      setActiveByIndex(currentIndex());
    }, 80);
  };
  window.addEventListener("scroll", onScrollThrottled, { passive: true });

  // Пересчёт позиций при ресайзе/изменении контента
  let resizeTimer = null;
  const onResizeDebounced = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      recomputePositions();
      setActiveByIndex(currentIndex());
    }, 120);
  };
  window.addEventListener("resize", onResizeDebounced);

  const ro = new ResizeObserver(() => onResizeDebounced());
  meta.forEach((m) => ro.observe(m.el));

  // Инициализация подсветки
  setTimeout(() => setActiveByIndex(currentIndex()), 50);

  // На всякий случай — компактное API
  window.SectionClicksOnly = {
    refresh() {
      recomputePositions();
      setActiveByIndex(currentIndex());
    },
    version: "1.0.0-min",
  };
});

// section-dots v2 — компактный, устойчивый, без обёрток
// Инициализация:
initSectionDots({
  sectionSelector: 'section[data-section][id]',
  navSelector: 'nav',     // куда монтировать кнопки
  offset: 0,              // высота фикс-хедера
  throttleMs: 80,         // троттлинг обновлений активки
  switchThresholdPx: 48,  // насколько новая секция должна обогнать текущую по видимости
  centerAssist: true,     // разрешать переключение при пересечении центра по направлению скролла
  centerBiasPx: 12,       // небольшой сдвиг центра вниз/вверх, влияет на переключение
  debug: true            // включить логи
});

function initSectionDots(opts = {}) {
  const cfg = {
    sectionSelector: 'section[data-section][id]',
    navSelector: 'nav',
    offset: 0,
    throttleMs: 80,
    switchThresholdPx: 48,
    centerAssist: true,
    centerBiasPx: 12,
    debug: false,
    ...opts
  };

  const nav = document.querySelector(cfg.navSelector);
  if (!nav) return console.warn(`[section-dots] nav "${cfg.navSelector}" не найден`);

  const sections = Array.from(document.querySelectorAll(cfg.sectionSelector))
    .filter(el => el.id && typeof el.dataset.section === 'string');

  if (!sections.length) return console.warn('[section-dots] секции не найдены');

  // 1) Построение кнопок
  const frag = document.createDocumentFragment();
  const btnById = new Map();

  for (const sec of sections) {
    const label = sec.dataset.section || sec.id;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dot';
    btn.dataset.target = `#${sec.id}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6" /></svg>`;
    btn.addEventListener('click', () => smoothScrollTo(sec, cfg.offset));
    frag.appendChild(btn);
    btnById.set(sec.id, btn);
  }
  nav.appendChild(frag);

  // 2) Состояние
  let activeId = '';
  let ticking = false;
  let lastTick = 0;
  let lastY = window.pageYOffset;
  let scrollDir = 0; // -1 вверх, 1 вниз, 0 нет
  const EPS = 0.75;  // отсечка сабпиксельного шума

  // 3) Хелперы
  function vp() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const center = Math.max(0, cfg.offset) + (vh - cfg.offset) / 2 + (cfg.centerBiasPx | 0);
    return { top: cfg.offset, bottom: vh, height: vh, center };
  }

  function visibleMetric(rect, viewport) {
    // видимая высота в пределах окна [offset .. vh]
    const visTop = Math.max(rect.top, viewport.top);
    const visBot = Math.min(rect.bottom, viewport.bottom);
    return Math.max(0, visBot - visTop);
  }

  function atBottom() {
    return (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 1);
  }

  function measureAll() {
    const viewport = vp();
    return sections.map(s => {
      const r = s.getBoundingClientRect();
      return {
        id: s.id,
        rect: r,
        visible: visibleMetric(r, viewport),
        center: r.top + r.height / 2
      };
    });
  }

  // 4) Алгоритм выбора активной секции
  function chooseActiveId() {
    const viewport = vp();

    // жёстко форсим последнюю секцию у нижней границы страницы
    if (atBottom()) return sections[sections.length - 1].id;

    const metrics = measureAll();

    // базовый кандидат — с максимальной видимой высотой
    let best = metrics[0];
    for (const m of metrics) if (m.visible - EPS > best.visible) best = m;

    if (!activeId) return best.id;

    // гистерезис: остаёмся на текущей, пока новая не выиграет заметно
    const cur = metrics.find(m => m.id === activeId) || best;
    const lead = best.visible - cur.visible;

    if (lead < cfg.switchThresholdPx) {
      // но поможем переключению, если двигаемся и новая перешла центр
      if (cfg.centerAssist) {
        const crossedDown = scrollDir > 0 && cur.center < viewport.center && best.center >= viewport.center;
        const crossedUp   = scrollDir < 0 && cur.center > viewport.center && best.center <= viewport.center;
        if (crossedDown || crossedUp) return best.id;
      }
      return activeId;
    }

    return best.id;
  }

  function setActive(id) {
    if (!id || id === activeId) return;
    activeId = id;
    for (const [secId, btn] of btnById) {
      btn.setAttribute('aria-current', String(secId === id));
    }
    if (cfg.debug) console.log('[section-dots] active ->', id);
  }

  // 5) Тикер
  function tick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const now = performance.now();
      if (now - lastTick >= cfg.throttleMs) {
        const y = window.pageYOffset;
        const dy = y - lastY;
        scrollDir = Math.abs(dy) < 0.5 ? 0 : (dy > 0 ? 1 : -1);
        lastY = y;

        setActive(chooseActiveId());
        lastTick = now;
      }
      ticking = false;
    });
  }

  // 6) Подписки
  const hasLenis = typeof window.lenis === 'object' && window.lenis && typeof window.lenis.on === 'function';
  if (hasLenis) {
    window.lenis.on('scroll', tick);
  } else {
    window.addEventListener('scroll', tick, { passive: true });
  }
  window.addEventListener('resize', tick, { passive: true });
  window.addEventListener('orientationchange', tick);
  window.addEventListener('load', tick);

  // когда контент меняет высоту (lazy, аккордеоны и т.п.)
  const ro = new ResizeObserver(tick);
  sections.forEach(s => ro.observe(s));

  // синхронизация по hash (если вдруг скроллится извне)
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && btnById.has(id)) setActive(id);
  });

  // старт
  tick();

  // 7) Скролл к секции
  function smoothScrollTo(el, extraOffset = 0) {
    const target = el.getBoundingClientRect().top + window.pageYOffset - extraOffset;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasLenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(target, { offset: 0 });
    } else {
      window.scrollTo({ top: target, behavior: prefersReduced ? 'auto' : 'smooth' });
    }

    setActive(el.id); // подсветить сразу
    if (history && history.replaceState) history.replaceState(null, '', `#${el.id}`);
  }
}

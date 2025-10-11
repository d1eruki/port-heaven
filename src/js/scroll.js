document.addEventListener("DOMContentLoaded", () => {
  // ---------- Config helpers ----------
  const rootStyle = getComputedStyle(document.documentElement);
  const readCSSVar = (name, fallback) => {
    const v = rootStyle.getPropertyValue(name).trim();
    return v || fallback;
  };
  const readNumberAttr = (el, name, fallback) => {
    const v = el.getAttribute(name);
    const n = v != null ? Number(v) : NaN;
    return Number.isFinite(n) ? n : fallback;
  };
  const readStringAttr = (el, name, fallback) => el.getAttribute(name) || fallback;

  // Body-driven config (без правки JS)
  const body = document.body;
  const THRESHOLD_FRACTION = Math.min(0.9, Math.max(0.05, readNumberAttr(body, "data-flip-threshold", 0.3))); // 0.05..0.9
  const EPS = Math.max(0, readNumberAttr(body, "data-eps", 5));
  const QUIET_MS = Math.max(0, readNumberAttr(body, "data-quiet-ms", 200));
  const MAX_LOCK_MS = Math.max(100, readNumberAttr(body, "data-max-lock-ms", 800));
  const ACTIVE_CLASS = readStringAttr(body, "data-active-class", "!text-white");
  const UPDATE_HASH = readStringAttr(body, "data-update-hash", "false") === "true";

  // Брейкпоинт из CSS-переменной, с запасным значением
  const bp = readCSSVar("--breakpoint-lg", "64rem");
  const mq = window.matchMedia(`(min-width: ${bp})`);

  // ---------- DOM ----------
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  if (!sections.length) return;

  // Кэш метаданных секций
  const meta = sections.map((el) => ({
    el,
    name: el.getAttribute("data-section") || "",
    top: 0,
    bottom: 0,
  }));

  // Быстрый доступ к навкнопкам по имени секции
  const allNavButtons = Array.from(document.querySelectorAll("[data-scroll-target]"));
  const navByName = new Map();
  for (const btn of allNavButtons) {
    const sel = btn.getAttribute("data-scroll-target");
    // Пытаемся извлечь имя секции из шаблона [data-section='NAME']
    let name = "";
    if (sel) {
      const m = sel.match(/\[data-section=['"]?([^'"\]]+)['"]?]/);
      if (m) name = m[1];
    }
    if (name) {
      if (!navByName.has(name)) navByName.set(name, []);
      navByName.get(name).push(btn);
    }
  }

  // ---------- State ----------
  let isProgrammatic = false;
  let wheelLock = false;
  let quietTimer = null;
  let endWatchRAF = 0;
  let stableFrames = 0;
  let lastY = 0;
  let lastActiveName = null;
  let isBound = false;
  let resizeTimer = null;
  let scrollTimer = null;

  // ---------- Positions / observers ----------
  const recomputePositions = () => {
    for (const m of meta) {
      const rect = m.el.getBoundingClientRect();
      const top = Math.round(rect.top + window.scrollY);
      m.top = top;
      m.bottom = top + Math.round(m.el.offsetHeight || rect.height);
    }
  };

  const ro = new ResizeObserver(() => {
    // высоты меняются — пересчитать и подровнять при необходимости
    if (isProgrammatic || wheelLock) return;
    recomputePositions();
    alignCurrentSection(); // мягкая подстройка
  });

  meta.forEach((m) => ro.observe(m.el));
  recomputePositions();

  // ---------- Core helpers ----------
  const currentIndex = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const threshold = vh * THRESHOLD_FRACTION;

    let idx = 0;
    for (let i = 0; i < meta.length; i++) {
      const top = meta[i].top;
      if (top <= y + vh - threshold) idx = i;
      else break; // позиции монотонны, можно выйти раньше
    }
    return idx;
  };

  const setActiveByIndex = (i) => {
    const m = meta[i];
    if (!m) return;
    if (m.name === lastActiveName) return;
    lastActiveName = m.name;

    // снять со всех
    for (const btn of allNavButtons) btn.classList.remove(ACTIVE_CLASS);
    // повесить на соответствующие
    const btns = navByName.get(m.name) || [];
    btns.forEach((b) => b.classList.add(ACTIVE_CLASS));

    if (UPDATE_HASH && m.name) {
      // не прыгаем, просто меняем адресную строку
      try {
        history.replaceState(null, "", `#${encodeURIComponent(m.name)}`);
      } catch {}
    }
  };

  const isScrollable = (el) => {
    if (!(el instanceof Element)) return false;
    const style = getComputedStyle(el);
    const canScrollY = /auto|scroll|overlay/.test(style.overflowY);
    return canScrollY && el.scrollHeight > el.clientHeight + 1;
  };

  const canScrollFurther = (el, dy) => {
    if (!isScrollable(el)) return false;
    if (dy > 0) {
      return Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight - 1;
    }
    if (dy < 0) {
      return el.scrollTop > 1;
    }
    return false;
  };

  const wheelInNestedScrollableAllowsNative = (target, dy) => {
    let node = target instanceof Node ? target : null;
    while (node && node !== document.body && node !== document.documentElement) {
      if (canScrollFurther(node, dy)) return true;
      node = node.parentNode;
    }
    return false;
  };

  const finishProgrammatic = () => {
    if (quietTimer) clearTimeout(quietTimer);
    quietTimer = setTimeout(() => {
      isProgrammatic = false;
      wheelLock = false;
    }, QUIET_MS);
  };

  const startStableWatch = (onFinished) => {
    let finished = false;

    const onScrollEnd = () => {
      if (finished) return;
      finished = true;
      try {
        window.removeEventListener("scrollend", onScrollEnd);
      } catch {}
      if (endWatchRAF) {
        cancelAnimationFrame(endWatchRAF);
        endWatchRAF = 0;
      }
      onFinished();
    };

    try {
      window.addEventListener("scrollend", onScrollEnd, { once: true });
    } catch {}

    lastY = -1;
    stableFrames = 0;

    const watch = () => {
      endWatchRAF = requestAnimationFrame(() => {
        const y = Math.round(window.scrollY);
        if (y === lastY) stableFrames++;
        else {
          stableFrames = 0;
          lastY = y;
        }

        if (!finished && stableFrames >= 6) {
          finished = true;
          try {
            window.removeEventListener("scrollend", onScrollEnd);
          } catch {}
          if (endWatchRAF) {
            cancelAnimationFrame(endWatchRAF);
            endWatchRAF = 0;
          }
          onFinished();
        } else if (!finished) {
          watch();
        } else {
          if (endWatchRAF) cancelAnimationFrame(endWatchRAF);
          endWatchRAF = 0;
        }
      });
    };
    watch();

    // страховка
    setTimeout(() => {
      if (finished) return;
      finished = true;
      try {
        window.removeEventListener("scrollend", onScrollEnd);
      } catch {}
      if (endWatchRAF) {
        cancelAnimationFrame(endWatchRAF);
        endWatchRAF = 0;
      }
      onFinished();
    }, MAX_LOCK_MS);
  };

  const scrollToIndex = (i) => {
    const m = meta[i];
    if (!m) return;
    // немедленно подсветить
    setActiveByIndex(i);

    isProgrammatic = true;
    wheelLock = true;

    startStableWatch(finishProgrammatic);
    window.scrollTo({ top: m.top, behavior: "smooth" });
  };

  const alignCurrentSection = () => {
    const i = currentIndex();
    const m = meta[i];
    if (!m) return;
    const diff = Math.abs(Math.round(window.scrollY) - Math.round(m.top));
    if (diff > EPS) scrollToIndex(i);
    else setActiveByIndex(i);
  };

  // ---------- Event handlers ----------
  const DELTA_THRESHOLD = 2;

  const onWheel = (e) => {
    const dy = e.deltaY || 0;
    const absY = Math.abs(dy);
    const absX = Math.abs(e.deltaX || 0);

    if (absY < DELTA_THRESHOLD || absY < 2 * absX) return;

    if (isProgrammatic || wheelLock) {
      e.preventDefault();
      return;
    }

    const idx = currentIndex();
    const m = meta[idx];
    if (!m) return;

    if (wheelInNestedScrollableAllowsNative(e.target, dy)) return;

    const rect = m.el.getBoundingClientRect();
    const vh = window.innerHeight;

    if (dy > 0) {
      if (rect.bottom > vh - EPS) return; // ещё не доехали до низа секции
      const target = Math.min(meta.length - 1, idx + 1);
      if (target === idx) return;
      e.preventDefault();
      isProgrammatic = true;
      wheelLock = true;
      scrollToIndex(target);
    } else if (dy < 0) {
      if (rect.top < -EPS) return; // ещё не выехали из верха секции
      const target = Math.max(0, idx - 1);
      if (target === idx) return;
      e.preventDefault();
      isProgrammatic = true;
      wheelLock = true;
      scrollToIndex(target);
    }
  };

  const onKeydown = (e) => {
    const k = e.key;
    if (!["PageDown", "PageUp", "ArrowDown", "ArrowUp", " "].includes(k)) return;

    if (isProgrammatic || wheelLock) {
      e.preventDefault();
      return;
    }

    let dir = 0;
    if (k === "PageDown" || k === "ArrowDown" || k === " ") dir = 1;
    if (k === "PageUp" || k === "ArrowUp") dir = -1;
    if (!dir) return;

    e.preventDefault();
    const idx = currentIndex();
    const target = Math.max(0, Math.min(meta.length - 1, idx + dir));
    if (target !== idx) {
      isProgrammatic = true;
      wheelLock = true;
      scrollToIndex(target);
    }
  };

  const onResizeDebounced = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isProgrammatic || wheelLock) return;
      recomputePositions();
      alignCurrentSection();
    }, 120);
  };

  const onScrollThrottled = () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (isProgrammatic || wheelLock) return;
      setActiveByIndex(currentIndex());
    }, 50);
  };

  // клики по навкнопкам
  const onDocClick = (e) => {
    const navButton = e.target.closest("[data-scroll-target]");
    if (!navButton) return;

    if (wheelLock) {
      // пока идёт программная прокрутка — игнор
      e.preventDefault();
      return;
    }

    const sel = navButton.getAttribute("data-scroll-target");
    if (!sel) return;
    const targetSection = document.querySelector(sel);
    if (!targetSection) return;
    e.preventDefault();

    const i = meta.findIndex((m) => m.el === targetSection);
    if (i >= 0) {
      isProgrammatic = true;
      wheelLock = true;
      scrollToIndex(i);
    }
  };

  // ---------- Binding ----------
  const bind = () => {
    if (isBound) return;
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeydown, { passive: false });
    window.addEventListener("resize", onResizeDebounced);
    window.addEventListener("scroll", onScrollThrottled, { passive: true });
    document.addEventListener("click", onDocClick);
    isBound = true;
  };

  const unbind = () => {
    if (!isBound) return;
    window.removeEventListener("wheel", onWheel, { passive: false });
    window.removeEventListener("keydown", onKeydown, { passive: false });
    window.removeEventListener("resize", onResizeDebounced);
    window.removeEventListener("scroll", onScrollThrottled, { passive: true });
    document.removeEventListener("click", onDocClick);
    isBound = false;

    isProgrammatic = false;
    wheelLock = false;

    if (quietTimer) {
      clearTimeout(quietTimer);
      quietTimer = null;
    }
    if (resizeTimer) {
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
    if (scrollTimer) {
      clearTimeout(scrollTimer);
      scrollTimer = null;
    }
    if (endWatchRAF) {
      cancelAnimationFrame(endWatchRAF);
      endWatchRAF = 0;
    }
    stableFrames = 0;
  };

  // media change
  const onMQ = (e) => {
    if (e.matches) {
      recomputePositions();
      bind();
      // сразу подсветить актуальную секцию
      setActiveByIndex(currentIndex());
    } else {
      unbind();
    }
  };

  // старт
  if (mq.matches) {
    bind();
    setTimeout(() => setActiveByIndex(currentIndex()), 50);
  }
  mq.addEventListener?.("change", onMQ);

  // Публичное API, вдруг пригодится
  window.SectionFlipper = {
    enable() {
      recomputePositions();
      bind();
      setActiveByIndex(currentIndex());
    },
    disable() {
      unbind();
    },
    align() {
      if (!isProgrammatic && !wheelLock) alignCurrentSection();
    },
    version: "1.1.0",
  };
});

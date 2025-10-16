// --- section dots: mount into #navigation, no IO, stable center-based picking ---
initSectionDots({
  sectionSelector: "section[data-section][id]",
  navigationId: "navigation",
  offset: 0, // компенсируй фикс-хедер, если нужно
  deadZone: 0, // px вокруг центра, можно оставить 0
  minUpdateInterval: 80, // мс, антидребезг обновления активки
});

function initSectionDots(opts = {}) {
  const { sectionSelector = "section[data-section][id]", navigationId = "navigation", offset = 0, deadZone = 0, minUpdateInterval = 80 } = opts;

  const container = document.getElementById(navigationId);
  if (!container) return console.warn(`[section-dots] Не найден #${navigationId}`);

  const sections = Array.from(document.querySelectorAll(sectionSelector)).filter((el) => el.id && typeof el.dataset.section === "string");

  if (!sections.length) return;

  // build UI
  const nav = document.createElement("nav");
  nav.id = "section-dots";
  nav.setAttribute("aria-label", "Навигация по секциям");
  nav.innerHTML = `<div class="dots" role="tablist" aria-orientation="vertical"></div>`;
  const list = nav.querySelector(".dots");
  container.appendChild(nav);

  const btnById = new Map();
  for (const sec of sections) {
    const label = sec.dataset.section || sec.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.role = "tab";
    btn.dataset.target = `#${sec.id}`;
    btn.title = label;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>`;
    btn.addEventListener("click", () => smoothScrollTo(sec, offset));
    list.appendChild(btn);
    btnById.set(sec.id, btn);
  }

  // geometry cache to avoid layout thrash
  let rects = [];
  function updateRects() {
    rects = sections.map((s) => ({ id: s.id, el: s, rect: s.getBoundingClientRect() }));
  }

  // choose active by nearest center to viewport center
  let lastSet = "";
  let lastUpdateTs = 0;

  function pickActiveId() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vpCenter = vh / 2;

    let best = null;
    let bestDelta = Infinity;

    for (const s of sections) {
      const r = s.getBoundingClientRect();
      const sectionCenter = r.top + r.height / 2;
      const delta = Math.abs(sectionCenter - vpCenter);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = s.id;
      }
    }

    // deadZone не даёт дёргаться, если пользователь стоит почти на границе
    if (deadZone > 0 && lastSet) {
      const current = document.getElementById(lastSet);
      if (current) {
        const rc = current.getBoundingClientRect();
        const curDelta = Math.abs(rc.top + rc.height / 2 - vpCenter);
        if (curDelta <= deadZone) return lastSet;
      }
    }
    return best || sections[0].id;
  }

  function setActive(id) {
    if (!id || id === lastSet) return;
    lastSet = id;
    for (const [secId, btn] of btnById) {
      btn.setAttribute("aria-current", String(secId === id));
    }
  }

  // rAF ticker with throttling to minUpdateInterval
  let ticking = false;
  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const now = performance.now();
      if (now - lastUpdateTs >= minUpdateInterval) {
        // геометрию читаем тут, чтобы не плодить reflow на каждом скролле
        // но на самом деле хватает прямого чтения без отдельного updateRects()
        setActive(pickActiveId());
        lastUpdateTs = now;
      }
      ticking = false;
    });
  }

  // integrate with Lenis if present
  const hasLenis = typeof window.lenis === "object" && window.lenis && typeof window.lenis.on === "function";
  if (hasLenis) {
    window.lenis.on("scroll", requestUpdate);
  } else {
    window.addEventListener("scroll", requestUpdate, { passive: true });
  }
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate);

  // initial paint
  requestUpdate();

  // smooth scroll respecting Lenis
  function smoothScrollTo(el, extraOffset = 0) {
    // целевая Y с учётом фикс-хедера
    const target = el.getBoundingClientRect().top + window.pageYOffset - extraOffset;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = window.lenis;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      window.scrollTo({ top: target, behavior: prefersReduced ? "auto" : "smooth" });
    }
    // мягкий «замок» активки: сразу выставляем нужную,
    // чтобы не мигала на старте анимации
    setActive(el.id);
    // остальное догонит тикер
  }
}

const SECTION_DOTS_VERSION = "2.1.1";

(function () {
  const init = () =>
    initSectionDots({
      sectionSelector: "section[data-section][id]",
      navSelector: "nav",
      offset: 0,
      throttleMs: 80,
      switchThresholdPx: 48,
      centerAssist: true,
      centerBiasPx: 12,
      minActivateVisiblePx: 96,
      debug: false,
    });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

function initSectionDots(opts = {}) {
  const cfg = {
    sectionSelector: "section[data-section][id]",
    navSelector: "nav",
    offset: 0,
    throttleMs: 80,
    switchThresholdPx: 48,
    centerAssist: true,
    centerBiasPx: 12,
    minActivateVisiblePx: 96,
    debug: false,
    ...opts,
  };

  const nav = document.querySelector(cfg.navSelector);
  if (!nav) return console.warn(`[section-dots] nav "${cfg.navSelector}" не найден`);

  const sections = Array.from(document.querySelectorAll(cfg.sectionSelector)).filter((el) => el.id && typeof el.dataset.section === "string");
  if (!sections.length) return console.warn("[section-dots] секции не найдены");

  const frag = document.createDocumentFragment();
  const btnById = new Map();

  for (const sec of sections) {
    const label = sec.dataset.section || sec.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dot";
    btn.dataset.target = `#${sec.id}`;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6" /></svg>`;
    btn.addEventListener("click", () => smoothScrollTo(sec, cfg.offset));
    frag.appendChild(btn);
    btnById.set(sec.id, btn);
  }
  nav.appendChild(frag);

  let activeId = "";
  let ticking = false;
  let lastTick = 0;
  let lastY = window.pageYOffset;
  let scrollDir = 0;
  const EPS = 0.75;

  function vp() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const center = Math.max(0, cfg.offset) + (vh - cfg.offset) / 2 + (cfg.centerBiasPx | 0);
    return { top: cfg.offset, bottom: vh, height: vh, center };
  }

  function visibleMetric(rect, viewport) {
    const visTop = Math.max(rect.top, viewport.top);
    const visBot = Math.min(rect.bottom, viewport.bottom);
    return Math.max(0, visBot - visTop);
  }

  function measureAll() {
    const viewport = vp();
    return sections.map((s) => {
      const r = s.getBoundingClientRect();
      return { id: s.id, rect: r, visible: visibleMetric(r, viewport), center: r.top + r.height / 2 };
    });
  }

  function chooseActiveId() {
    const viewport = vp();
    const metrics = measureAll();
    const anyVis = metrics.some((m) => m.visible > 0);
    if (!anyVis) return "";
    let best = metrics[0];
    for (const m of metrics) if (m.visible - EPS > best.visible) best = m;
    if (best.visible < cfg.minActivateVisiblePx) return "";
    if (!activeId) return best.id;
    const cur = metrics.find((m) => m.id === activeId) || best;
    const lead = best.visible - cur.visible;
    if (lead < cfg.switchThresholdPx) {
      if (cfg.centerAssist) {
        const crossedDown = scrollDir > 0 && cur.center < viewport.center && best.center >= viewport.center;
        const crossedUp = scrollDir < 0 && cur.center > viewport.center && best.center <= viewport.center;
        if (crossedDown || crossedUp) return best.id;
      }
      return activeId;
    }
    return best.id;
  }

  function setActive(id) {
    if (id === activeId) return;
    activeId = id || "";
    for (const [secId, btn] of btnById) btn.setAttribute("aria-current", String(secId === activeId));
    if (cfg.debug) console.log("[section-dots] active ->", activeId || "(none)");
  }

  function tick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const now = performance.now();
      if (now - lastTick >= cfg.throttleMs) {
        const y = window.pageYOffset;
        const dy = y - lastY;
        scrollDir = Math.abs(dy) < 0.5 ? 0 : dy > 0 ? 1 : -1;
        lastY = y;
        setActive(chooseActiveId());
        lastTick = now;
      }
      ticking = false;
    });
  }

  const hasLenis = typeof window.lenis === "object" && window.lenis && typeof window.lenis.on === "function";
  if (hasLenis) window.lenis.on("scroll", tick);
  else window.addEventListener("scroll", tick, { passive: true });

  window.addEventListener("resize", tick, { passive: true });
  window.addEventListener("orientationchange", tick);
  window.addEventListener("load", tick);

  const ro = new ResizeObserver(tick);
  sections.forEach((s) => ro.observe(s));

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id && btnById.has(id)) setActive(id);
    else if (!id) setActive("");
  });

  tick();

  function smoothScrollTo(el, extraOffset = 0) {
    const target = el.getBoundingClientRect().top + window.pageYOffset - extraOffset;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hasLenis && typeof window.lenis.scrollTo === "function") {
      window.lenis.scrollTo(target, { offset: 0 });
    } else {
      window.scrollTo({ top: target, behavior: prefersReduced ? "auto" : "smooth" });
    }
    setActive(el.id);
    if (history && history.replaceState) history.replaceState(null, "", `#${el.id}`);
  }
}

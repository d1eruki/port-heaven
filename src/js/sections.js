// --- section dots: mount buttons directly inside <nav>, each button has class="dot" ---
initSectionDots({
  sectionSelector: "section[data-section][id]",
  navSelector: "nav", // твой контейнер
  offset: 0,
  deadZone: 0,
  minUpdateInterval: 80,
});

function initSectionDots(opts = {}) {
  const { sectionSelector = "section[data-section][id]", navSelector = "nav", offset = 0, deadZone = 0, minUpdateInterval = 80 } = opts;

  const nav = document.querySelector(navSelector);
  if (!nav) return console.warn(`[section-dots] Не найден контейнер "${navSelector}"`);

  const sections = Array.from(document.querySelectorAll(sectionSelector)).filter((el) => el.id && typeof el.dataset.section === "string");
  if (!sections.length) return;

  // создаём кнопки-шарики
  const frag = document.createDocumentFragment();
  const btnById = new Map();

  for (const sec of sections) {
    const label = sec.dataset.section || sec.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dot";
    btn.dataset.target = `#${sec.id}`;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>`;
    btn.addEventListener("click", () => smoothScrollTo(sec, offset));
    frag.appendChild(btn);
    btnById.set(sec.id, btn);
  }
  nav.appendChild(frag);

  // определение активной секции
  let lastSet = "";
  let lastUpdateTs = 0;
  let ticking = false;

  function pickActiveId() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vpCenter = vh / 2;
    let bestId = sections[0].id;
    let bestDelta = Infinity;

    for (const s of sections) {
      const r = s.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const d = Math.abs(center - vpCenter);
      if (d < bestDelta) {
        bestDelta = d;
        bestId = s.id;
      }
    }

    if (deadZone > 0 && lastSet) {
      const cur = document.getElementById(lastSet);
      if (cur) {
        const rc = cur.getBoundingClientRect();
        const curDelta = Math.abs(rc.top + rc.height / 2 - vpCenter);
        if (curDelta <= deadZone) return lastSet;
      }
    }
    return bestId;
  }

  function setActive(id) {
    if (!id || id === lastSet) return;
    lastSet = id;
    for (const [secId, btn] of btnById) {
      btn.setAttribute("aria-current", String(secId === id));
    }
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const now = performance.now();
      if (now - lastUpdateTs >= minUpdateInterval) {
        setActive(pickActiveId());
        lastUpdateTs = now;
      }
      ticking = false;
    });
  }

  // подписки
  const hasLenis = typeof window.lenis === "object" && window.lenis && typeof window.lenis.on === "function";
  if (hasLenis) {
    window.lenis.on("scroll", requestUpdate);
  } else {
    window.addEventListener("scroll", requestUpdate, { passive: true });
  }
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate);
  requestUpdate();

  // плавный скролл
  function smoothScrollTo(el, extraOffset = 0) {
    const target = el.getBoundingClientRect().top + window.pageYOffset - extraOffset;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = window.lenis;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      window.scrollTo({ top: target, behavior: prefersReduced ? "auto" : "smooth" });
    }
    setActive(el.id);
  }
}

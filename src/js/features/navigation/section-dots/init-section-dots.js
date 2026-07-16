import { getScrollY } from "../../../utils/scroll";
import { smoothScrollTo } from "../../../utils/smooth-scroll";
import { DOM_SELECTORS } from "../../../dom/dom-selectors";
import { chooseActiveSectionId, getViewportMetrics, measureSections } from "./active-section";
import { attachSectionDotEvents } from "./events";

export function initSectionDots(opts = {}) {
  const cfg = {
    sectionSelector: DOM_SELECTORS.sectionNavTargets,
    navSelector: DOM_SELECTORS.sectionNav,
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

  const sections = Array.from(document.querySelectorAll(cfg.sectionSelector)).filter(
    (el) => el.id && typeof el.dataset.section === "string",
  );
  if (!sections.length) return console.warn("[section-dots] секции не найдены");

  let activeId = "";
  let ticking = false;
  let lastTick = 0;
  let lastY = getScrollY();
  let scrollDir = 0;

  function setActive(id) {
    if (id === activeId) return;
    activeId = id || "";
    for (const [secId, btn] of btnById) {
      btn.setAttribute("aria-current", String(secId === activeId));
    }
    if (cfg.debug) console.log("[section-dots] active ->", activeId || "(none)");
  }

  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const btnById = new Map();

  nav.querySelectorAll("button.dot[data-target]").forEach((btn) => {
    const id = btn.dataset.target?.replace(/^#/, "");
    const section = sectionById.get(id);
    if (!section) return;

    btn.addEventListener("click", () => {
      smoothScrollTo(section, { offset: cfg.offset });
      setActive(id);
      history.replaceState(null, "", `#${id}`);
    });
    btnById.set(id, btn);
  });

  if (!btnById.size) return console.warn("[section-dots] кнопки навигации не найдены");

  function resolveActiveId() {
    const viewport = getViewportMetrics(cfg);
    const metrics = measureSections(sections, viewport);
    return chooseActiveSectionId({ metrics, viewport, activeId, scrollDir, cfg });
  }

  function tick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const now = performance.now();
      if (now - lastTick >= cfg.throttleMs) {
        const y = getScrollY();
        const dy = y - lastY;
        scrollDir = Math.abs(dy) < 0.5 ? 0 : dy > 0 ? 1 : -1;
        lastY = y;
        setActive(resolveActiveId());
        lastTick = now;
      }
      ticking = false;
    });
  }

  attachSectionDotEvents({ sections, btnById, tick, setActive });
  tick();
}

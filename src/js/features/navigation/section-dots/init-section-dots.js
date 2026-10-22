import { smoothScrollTo } from "../../../utils/smooth-scroll";
import { DOM_SELECTORS } from "../../../dom/dom-selectors";
import { attachSectionDotEvents } from "./events";

export function initSectionDots(opts = {}) {
  const cfg = {
    sectionSelector: DOM_SELECTORS.sectionNavTargets,
    navSelector: DOM_SELECTORS.sectionNav,
    offset: 0,
    centerBiasPx: 12,
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

  attachSectionDotEvents({
    sections,
    btnById,
    setActive,
    centerBiasPx: cfg.centerBiasPx,
  });
}

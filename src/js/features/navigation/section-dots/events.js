import { onScroll } from "../../../utils/scroll";

export function attachSectionDotEvents({ sections, btnById, tick, setActive }) {
  onScroll(tick);

  window.addEventListener("resize", tick, { passive: true });
  window.addEventListener("orientationchange", tick);
  window.addEventListener("load", tick);

  const ro = new ResizeObserver(tick);
  sections.forEach((section) => ro.observe(section));

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id && btnById.has(id)) setActive(id);
    else if (!id) setActive("");
  });
}

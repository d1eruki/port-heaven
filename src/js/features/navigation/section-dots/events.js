import { onScroll } from "../../../utils/scroll";

export function attachSectionDotEvents({ sections, btnById, tick, setActive }) {
  const offScroll = onScroll(tick);

  const onHashChange = () => {
    const id = location.hash.slice(1);
    if (id && btnById.has(id)) setActive(id);
    else if (!id) setActive("");
  };

  const ro = new ResizeObserver(tick);
  sections.forEach((section) => ro.observe(section));

  window.addEventListener("resize", tick, { passive: true });
  window.addEventListener("orientationchange", tick);
  window.addEventListener("load", tick);
  window.addEventListener("hashchange", onHashChange);

  return () => {
    if (typeof offScroll === "function") offScroll();
    window.removeEventListener("resize", tick);
    window.removeEventListener("orientationchange", tick);
    window.removeEventListener("load", tick);
    window.removeEventListener("hashchange", onHashChange);
    ro.disconnect();
  };
}

import { ScrollTrigger } from "../../../libraries/gsap-scroll";

export function attachSectionDotEvents({ sections, btnById, setActive, centerBiasPx }) {
  const center = `center+=${centerBiasPx}px`;
  const activateSection = (id) => {
    setActive(id);
    const hash = id === "hero" ? "" : `#${encodeURIComponent(id)}`;
    if (location.hash !== hash) {
      history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`);
    }
  };

  sections.forEach((section) => {
    if (section.id !== "hero" && !btnById.has(section.id)) return;

    ScrollTrigger.create({
      trigger: section,
      start: `top ${center}`,
      end: `bottom ${center}`,
      onToggle: (self) => {
        if (self.isActive) activateSection(section.id);
      },
      invalidateOnRefresh: true,
    });
  });

  const viewportCenter = window.innerHeight / 2 + centerBiasPx;
  const currentSection = sections.find((section) => {
    if (section.id !== "hero" && !btnById.has(section.id)) return false;
    const bounds = section.getBoundingClientRect();
    return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
  });
  if (currentSection) activateSection(currentSection.id);

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id && btnById.has(id)) setActive(id);
    else if (!id) setActive("");
  });
}

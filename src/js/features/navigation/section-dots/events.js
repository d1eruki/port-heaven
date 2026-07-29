import { ScrollTrigger } from "../../../libraries/gsap-scroll";

export function attachSectionDotEvents({ sections, btnById, setActive, centerBiasPx }) {
  const center = `center+=${centerBiasPx}px`;

  sections.forEach((section) => {
    if (!btnById.has(section.id)) return;

    ScrollTrigger.create({
      trigger: section,
      start: `top ${center}`,
      end: `bottom ${center}`,
      onToggle: (self) => {
        if (self.isActive) setActive(section.id);
      },
      invalidateOnRefresh: true,
    });
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id && btnById.has(id)) setActive(id);
    else if (!id) setActive("");
  });
}

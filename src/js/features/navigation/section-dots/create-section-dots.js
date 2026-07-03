import { smoothScrollTo } from "../../../utils/smooth-scroll";

export function createSectionDots({ nav, sections, offset, onSelect }) {
  const frag = document.createDocumentFragment();
  const btnById = new Map();

  for (const section of sections) {
    const label = section.dataset.section || section.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dot";
    btn.dataset.target = `#${section.id}`;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="6" /></svg>`;
    btn.addEventListener("click", () => {
      smoothScrollTo(section, { offset });
      onSelect(section.id);
      if (history && history.replaceState) history.replaceState(null, "", `#${section.id}`);
    });
    frag.appendChild(btn);
    btnById.set(section.id, btn);
  }

  nav.appendChild(frag);
  return btnById;
}

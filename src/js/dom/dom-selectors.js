const selectorById = (id) => `#${id}`;

export const SECTION_IDS = {
  projects: "projects",
  creatives: "creatives",
};

export const DOM_DATA_ATTRIBUTES = {
  designIntro: "data-design-intro",
  designName: "data-design-name",
  projectSnap: "data-project-snap",
  scrollToTop: "data-scroll-to-top",
  section: "data-section",
  sectionNav: "data-section-nav",
};

export const DOM_IDS = {
  design: "design",
  designInner: "design-inner",
  designViewport: "design-viewport",
  menuDot: "menu-dot",
  progressBar: "progress-bar",
  scrollToTop: "scroll-to-top",
};

export const DOM_SELECTORS = {
  designItems: `[${DOM_DATA_ATTRIBUTES.designName}]`,
  designIntro: `[${DOM_DATA_ATTRIBUTES.designIntro}]`,
  menuDot: `body > ${selectorById(DOM_IDS.menuDot)}, ${selectorById(DOM_IDS.menuDot)}`,
  progressBar: selectorById(DOM_IDS.progressBar),
  projectSnap: `[${DOM_DATA_ATTRIBUTES.projectSnap}]`,
  scrollToTop: `${selectorById(DOM_IDS.scrollToTop)}, [${DOM_DATA_ATTRIBUTES.scrollToTop}]`,
  sectionNav: `[${DOM_DATA_ATTRIBUTES.sectionNav}]`,
  sectionNavTargets: `[${DOM_DATA_ATTRIBUTES.section}][id]`,
  sections: `[${DOM_DATA_ATTRIBUTES.section}][id]`,
};

const selectorById = (id) => `#${id}`;

export const SECTION_IDS = {
  hero: "hero",
  description: "description",
  about: "about",
  projects: "projects",
  design: "design",
  creatives: "creatives",
  footer: "footer",
};

export const SECTION_NAV_IDS = [
  SECTION_IDS.description,
  SECTION_IDS.about,
  SECTION_IDS.projects,
  SECTION_IDS.design,
  SECTION_IDS.creatives,
  SECTION_IDS.footer,
];

export const DOM_DATA_ATTRIBUTES = {
  designIntro: "data-design-intro",
  designName: "data-design-name",
  scrollToTop: "data-scroll-to-top",
  section: "data-section",
  sectionNav: "data-section-nav",
};

export const DOM_IDS = {
  design: SECTION_IDS.design,
  designInner: "design-inner",
  menuDot: "menu-dot",
  progressBar: "progress-bar",
  scrollToTop: "scroll-to-top",
};

export const DOM_SELECTORS = {
  designItems: `[${DOM_DATA_ATTRIBUTES.designName}]`,
  designIntro: `[${DOM_DATA_ATTRIBUTES.designIntro}]`,
  menuDot: `body > ${selectorById(DOM_IDS.menuDot)}, ${selectorById(DOM_IDS.menuDot)}`,
  progressBar: selectorById(DOM_IDS.progressBar),
  scrollToTop: `${selectorById(DOM_IDS.scrollToTop)}, [${DOM_DATA_ATTRIBUTES.scrollToTop}]`,
  sectionNav: `[${DOM_DATA_ATTRIBUTES.sectionNav}]`,
  sectionNavTargets: SECTION_NAV_IDS.map(
    (id) => `section[${DOM_DATA_ATTRIBUTES.section}="${id}"]${selectorById(id)}`,
  ).join(", "),
  sections: Object.values(SECTION_IDS)
    .map((id) => `section[${DOM_DATA_ATTRIBUTES.section}="${id}"]${selectorById(id)}`)
    .join(", "),
};

const selectorById = (id) => `#${id}`;

export const SECTION_IDS = {
  hero: "hero",
  description: "description",
  about: "about",
  projects: "projects",
  design: "design",
  creatives: "creatives",
  pricing: "pricing",
  footer: "footer",
};

export const SECTION_NAV_ITEMS = [
  { id: SECTION_IDS.hero, labelKey: "navigation.sections.hero" },
  { id: SECTION_IDS.description, labelKey: "navigation.sections.description" },
  { id: SECTION_IDS.about, labelKey: "navigation.sections.about" },
  { id: SECTION_IDS.projects, labelKey: "navigation.sections.projects" },
  { id: SECTION_IDS.design, labelKey: "navigation.sections.design" },
  { id: SECTION_IDS.creatives, labelKey: "navigation.sections.creatives" },
  { id: SECTION_IDS.pricing, labelKey: "navigation.sections.pricing" },
  { id: SECTION_IDS.footer, labelKey: "navigation.sections.footer" },
];

export const SECTION_NAV_IDS = SECTION_NAV_ITEMS.map(({ id }) => id);

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
    (id) => `[${DOM_DATA_ATTRIBUTES.section}="${id}"]${selectorById(id)}`,
  ).join(", "),
  sections: Object.values(SECTION_IDS)
    .map((id) => `[${DOM_DATA_ATTRIBUTES.section}="${id}"]${selectorById(id)}`)
    .join(", "),
};

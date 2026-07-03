const selectorById = (id) => `#${id}`;

export const SECTION_IDS = {
  description: "description",
  about: "about",
  projects: "projects",
  design: "design",
  creatives: "creatives",
  footer: "footer",
};

export const DOM_DATA_ATTRIBUTES = {
  designIntro: "data-design-intro",
  designName: "data-design-name",
  scrollToTop: "data-scroll-to-top",
  section: "data-section",
  sectionNav: "data-section-nav",
  themeToggleLabel: "data-theme-toggle-label",
};

export const DOM_IDS = {
  design: SECTION_IDS.design,
  designInner: "design-inner",
  langToggle: "lang-toggle",
  menuDot: "menu-dot",
  progressBar: "progress-bar",
  scrollToTop: "scroll-to-top",
  themeToggle: "theme-toggle",
};

export const DOM_SELECTORS = {
  designItems: `[${DOM_DATA_ATTRIBUTES.designName}]`,
  designIntro: `[${DOM_DATA_ATTRIBUTES.designIntro}]`,
  langToggle: selectorById(DOM_IDS.langToggle),
  menuDot: `body > ${selectorById(DOM_IDS.menuDot)}, ${selectorById(DOM_IDS.menuDot)}`,
  progressBar: selectorById(DOM_IDS.progressBar),
  scrollToTop: `${selectorById(DOM_IDS.scrollToTop)}, [${DOM_DATA_ATTRIBUTES.scrollToTop}]`,
  sectionNav: `[${DOM_DATA_ATTRIBUTES.sectionNav}]`,
  sections: Object.values(SECTION_IDS)
    .map((id) => `section[${DOM_DATA_ATTRIBUTES.section}="${id}"]${selectorById(id)}`)
    .join(", "),
  themeToggle: selectorById(DOM_IDS.themeToggle),
  themeToggleLabel: `[${DOM_DATA_ATTRIBUTES.themeToggleLabel}]`,
};

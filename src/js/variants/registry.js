export const BASE_VARIANT = "stasis";
export const LANCET_VARIANT = "lancet";

export const DEFAULT_THEME = "dark";

export const VARIANT_FEATURES = {
  SECTION_DOTS: "section-dots",
  SCROLL_TO_TOP: "scroll-to-top",
  MENU_DOT: "menu-dot",
  HERO_BG_CELLS: "hero-bg-cells",
  DESIGN_ACTIVE: "design-active",
  ODOMETER_COUNTER: "odometer-counter",
  PROGRESS_BAR: "progress-bar",
  PARALLAX: "parallax",
  VANILLA_TILT: "vanilla-tilt",
  CURSOR: "cursor",
  HORIZONTAL_SCROLL: "horizontal-scroll",
  LANCET_SECTION_SCROLL: "lancet-section-scroll",
  LANCET_SCROLL_CARD: "lancet-scroll-card",
};

const VARIANT_THEME_MODE = {
  SAVED: "saved",
  FORCED: "forced",
};

export const VARIANTS = [
  {
    key: BASE_VARIANT,
    label: "stasis",
    shell: "default",
    theme: {
      mode: VARIANT_THEME_MODE.SAVED,
    },
    features: [
      VARIANT_FEATURES.SECTION_DOTS,
      VARIANT_FEATURES.SCROLL_TO_TOP,
      VARIANT_FEATURES.MENU_DOT,
      VARIANT_FEATURES.HERO_BG_CELLS,
      VARIANT_FEATURES.DESIGN_ACTIVE,
      VARIANT_FEATURES.ODOMETER_COUNTER,
      VARIANT_FEATURES.PROGRESS_BAR,
      VARIANT_FEATURES.PARALLAX,
      VARIANT_FEATURES.VANILLA_TILT,
      VARIANT_FEATURES.CURSOR,
      VARIANT_FEATURES.HORIZONTAL_SCROLL,
    ],
  },
  {
    key: LANCET_VARIANT,
    label: "lancet",
    shell: "lancet",
    theme: {
      mode: VARIANT_THEME_MODE.FORCED,
      value: "dark",
    },
    features: [
      VARIANT_FEATURES.SCROLL_TO_TOP,
      VARIANT_FEATURES.PROGRESS_BAR,
      VARIANT_FEATURES.PARALLAX,
      VARIANT_FEATURES.LANCET_SECTION_SCROLL,
      VARIANT_FEATURES.LANCET_SCROLL_CARD,
    ],
  },
];

export const VARIANT_KEYS = VARIANTS.map((variant) => variant.key);

export const DEFAULT_VARIANT = BASE_VARIANT;

export const getVariantConfig = (variantKey) =>
  VARIANTS.find((variant) => variant.key === variantKey) ||
  VARIANTS.find((variant) => variant.key === DEFAULT_VARIANT);

export const isSupportedVariant = (variantKey) => VARIANT_KEYS.includes(variantKey);

export const getVariantLabel = (variantKey) => getVariantConfig(variantKey).label;

export const getVariantShell = (variantKey) => getVariantConfig(variantKey).shell;

export const variantHasFeature = (variantKey, feature) =>
  getVariantConfig(variantKey).features.includes(feature);

export const getVariantThemeValue = (variantKey, savedTheme = DEFAULT_THEME) => {
  const theme = getVariantConfig(variantKey).theme;

  if (theme?.mode === VARIANT_THEME_MODE.FORCED) return theme.value;

  return savedTheme;
};

export const getNextVariantKey = (variantKey) => {
  const index = VARIANT_KEYS.indexOf(variantKey);
  const nextIndex = index >= 0 ? (index + 1) % VARIANT_KEYS.length : 0;

  return VARIANT_KEYS[nextIndex];
};

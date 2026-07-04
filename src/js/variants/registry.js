export const BASE_VARIANT = "stasis";
export const LANCET_VARIANT = "lancet";

export const DEFAULT_THEME = "dark";

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
  },
  {
    key: LANCET_VARIANT,
    label: "lancet",
    shell: "lancet",
    theme: {
      mode: VARIANT_THEME_MODE.FORCED,
      value: "dark",
    },
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

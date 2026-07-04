import { ref } from "vue";
import { readStorageValue, saveStorageValue } from "../../utils/storage";
import {
  BASE_VARIANT,
  DEFAULT_THEME,
  DEFAULT_VARIANT,
  getNextVariantKey,
  getVariantThemeValue,
  isSupportedVariant,
  LANCET_VARIANT,
  VARIANT_KEYS,
} from "../../variants/registry";

const root = document.documentElement;
const VARIANT_STORAGE_KEY = "variant";
const THEME_STORAGE_KEY = "theme";
export { BASE_VARIANT, LANCET_VARIANT };
export const VARIANTS = VARIANT_KEYS;
const VARIANT_WILL_CHANGE_EVENT = "variant:will-change";
const VARIANT_DID_CHANGE_EVENT = "variant:did-change";

const getCurrentVariant = () => {
  const variant = root.getAttribute("data-variant");
  return isSupportedVariant(variant) ? variant : DEFAULT_VARIANT;
};

const dispatchVariantEvent = (name, detail) => {
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export const currentVariant = ref(DEFAULT_VARIANT);

export const readSavedVariant = () =>
  readStorageValue({
    key: VARIANT_STORAGE_KEY,
    fallback: DEFAULT_VARIANT,
    isValid: isSupportedVariant,
  });

export const saveVariant = (variant) =>
  saveStorageValue({
    key: VARIANT_STORAGE_KEY,
    value: variant,
    isValid: isSupportedVariant,
  });

export const applyVariant = (variant) => {
  const nextVariant = isSupportedVariant(variant) ? variant : DEFAULT_VARIANT;
  const previousVariant = getCurrentVariant();

  if (previousVariant !== nextVariant) {
    dispatchVariantEvent(VARIANT_WILL_CHANGE_EVENT, {
      previousVariant,
      variant: nextVariant,
    });
  }

  root.setAttribute("data-variant", nextVariant);
  root.setAttribute(
    "data-theme",
    getVariantThemeValue(
      nextVariant,
      readStorageValue({ key: THEME_STORAGE_KEY, fallback: DEFAULT_THEME }),
    ),
  );

  currentVariant.value = nextVariant;

  dispatchVariantEvent(VARIANT_DID_CHANGE_EVENT, {
    previousVariant,
    variant: nextVariant,
  });

  return nextVariant;
};

export const applyInitialVariant = () => {
  applyVariant(readSavedVariant());
};

export const getTargetVariant = () => {
  return getNextVariantKey(currentVariant.value);
};

export const setVariant = (variant) => {
  const nextVariant = applyVariant(variant);
  saveVariant(nextVariant);
  return nextVariant;
};

import { ref } from "vue";
import { readStorageValue, saveStorageValue } from "../../utils/storage";

const root = document.documentElement;
const VARIANT_STORAGE_KEY = "variant";
const THEME_STORAGE_KEY = "theme";
export const BASE_VARIANT = "stasis";
export const LANCET_VARIANT = "lancet";
const DEFAULT_VARIANT = BASE_VARIANT;
const DEFAULT_THEME = "dark";
export const VARIANTS = [BASE_VARIANT, LANCET_VARIANT];
const VARIANT_WILL_CHANGE_EVENT = "variant:will-change";
const VARIANT_DID_CHANGE_EVENT = "variant:did-change";

const isSupportedVariant = (variant) => VARIANTS.includes(variant);
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

  if (nextVariant === LANCET_VARIANT) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.setAttribute(
      "data-theme",
      readStorageValue({ key: THEME_STORAGE_KEY, fallback: DEFAULT_THEME }),
    );
  }

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
  const index = VARIANTS.indexOf(currentVariant.value);
  const nextIndex = index >= 0 ? (index + 1) % VARIANTS.length : 0;
  return VARIANTS[nextIndex];
};

export const setVariant = (variant) => {
  const nextVariant = applyVariant(variant);
  saveVariant(nextVariant);
  return nextVariant;
};

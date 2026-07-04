import { ref } from "vue";
import { readStorageValue, saveStorageValue } from "../../utils/storage";

const root = document.documentElement;
const VARIANT_STORAGE_KEY = "variant";
const THEME_STORAGE_KEY = "theme";
const DEFAULT_VARIANT = "stasis";
const DEFAULT_THEME = "dark";
const VARIANTS = ["stasis", "lancet"];

const isSupportedVariant = (variant) => VARIANTS.includes(variant);

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
  root.setAttribute("data-variant", nextVariant);

  if (nextVariant === "lancet") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.setAttribute("data-theme", readStorageValue({ key: THEME_STORAGE_KEY, fallback: DEFAULT_THEME }));
  }

  currentVariant.value = nextVariant;
  return nextVariant;
};

export const applyInitialVariant = () => {
  applyVariant(readSavedVariant());
};

export const getTargetVariant = () => (currentVariant.value === "lancet" ? "stasis" : "lancet");

export const setVariant = (variant) => {
  const nextVariant = applyVariant(variant);
  saveVariant(nextVariant);
  return nextVariant;
};

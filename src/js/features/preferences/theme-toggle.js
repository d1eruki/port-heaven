import { readStorageValue, saveStorageValue } from "../../utils/storage";

const root = document.documentElement;
const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";
const isSupportedTheme = (theme) => theme === "light" || theme === "dark";

export const readSavedTheme = () =>
  readStorageValue({
    key: THEME_STORAGE_KEY,
    fallback: DEFAULT_THEME,
    isValid: isSupportedTheme,
  });

export const saveTheme = (theme) =>
  saveStorageValue({
    key: THEME_STORAGE_KEY,
    value: theme,
    isValid: isSupportedTheme,
  });

export const applyInitialTheme = () => {
  applyTheme(readSavedTheme());
};

export const getCurrentTheme = () => {
  const theme = root.getAttribute("data-theme");
  return isSupportedTheme(theme) ? theme : DEFAULT_THEME;
};

export const getTargetTheme = () => (getCurrentTheme() === "dark" ? "light" : "dark");

export const applyTheme = (theme) => {
  const nextTheme = isSupportedTheme(theme) ? theme : DEFAULT_THEME;
  root.setAttribute("data-theme", nextTheme);
  return nextTheme;
};

export const setTheme = (theme) => {
  const nextTheme = applyTheme(theme);
  saveTheme(nextTheme);
  return nextTheme;
};

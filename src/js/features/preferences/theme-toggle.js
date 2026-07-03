const root = document.documentElement;
const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "dark";
const isSupportedTheme = (theme) => theme === "light" || theme === "dark";

export const readSavedTheme = () => {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return isSupportedTheme(theme) ? theme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const saveTheme = (theme) => {
  if (!isSupportedTheme(theme)) return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
};

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

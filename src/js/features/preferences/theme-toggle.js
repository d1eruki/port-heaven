import { useColorMode } from "@vueuse/core";
import darkFaviconUrl from "../../../assets/favicon-dark.png";
import lightFaviconUrl from "../../../assets/favicon-light.png";
import { useValidatedStorage } from "./storage";

const root = document.documentElement;
const faviconLink = document.querySelector('link[rel~="icon"]');
const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";
const faviconByTheme = {
  dark: darkFaviconUrl,
  light: lightFaviconUrl,
};
const isSupportedTheme = (theme) => theme === "light" || theme === "dark";
const savedTheme = useValidatedStorage({
  key: THEME_STORAGE_KEY,
  fallback: DEFAULT_THEME,
  isValid: isSupportedTheme,
});

const applyThemeToDocument = (theme) => {
  const nextTheme = isSupportedTheme(theme) ? theme : DEFAULT_THEME;
  root.setAttribute("data-theme", nextTheme);
  if (faviconLink) faviconLink.href = faviconByTheme[nextTheme];
};

export const currentTheme = useColorMode({
  attribute: "data-theme",
  initialValue: DEFAULT_THEME,
  storageRef: savedTheme,
  disableTransition: false,
  onChanged: applyThemeToDocument,
});

export const applyInitialTheme = () => {
  applyThemeToDocument(currentTheme.value);
};

export const getCurrentTheme = () => currentTheme.value;

export const getTargetTheme = () => (getCurrentTheme() === "dark" ? "light" : "dark");

export const setTheme = (theme) => {
  const nextTheme = isSupportedTheme(theme) ? theme : DEFAULT_THEME;
  currentTheme.value = nextTheme;
  return nextTheme;
};

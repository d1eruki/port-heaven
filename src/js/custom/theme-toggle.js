import { t } from "../libraries/i18n";
import { onReady } from "../utils/onReady";

const root = document.documentElement;
const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "dark";
const isSupportedTheme = (theme) => theme === "light" || theme === "dark";

const readSavedTheme = () => {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return isSupportedTheme(theme) ? theme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

const saveTheme = (theme) => {
  if (!isSupportedTheme(theme)) return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
};

export const applyInitialTheme = () => {
  root.setAttribute("data-theme", readSavedTheme());
};

const getTargetTheme = () => (root.getAttribute("data-theme") === "dark" ? "light" : "dark");

const updateThemeToggleLabel = () => {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const label = t(`theme-toggle.${getTargetTheme()}`);
  const labelEl = btn.querySelector("[data-theme-toggle-label]");

  if (labelEl) {
    labelEl.textContent = label;
  }

  btn.setAttribute("aria-label", label);
};

export const initThemeToggle = () => {
  onReady(function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      updateThemeToggleLabel();

      btn.onclick = function () {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", nextTheme);
        saveTheme(nextTheme);
        updateThemeToggleLabel();
      };
    }

    window.addEventListener("localechange", updateThemeToggleLabel);
  });
};

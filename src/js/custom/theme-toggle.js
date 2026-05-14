import { onReady } from "../utils/onReady";

(function () {
  const root = document.documentElement;
  const THEME_STORAGE_KEY = "theme";
  const DEFAULT_THEME = "light";
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

  if (!root.getAttribute("data-theme")) {
    root.setAttribute("data-theme", readSavedTheme());
  }

  onReady(function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.onclick = function () {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", nextTheme);
        saveTheme(nextTheme);
      };
    }
  });
})();

import { t } from "../libraries/i18n";
import { onReady } from "../utils/onReady";

(function () {
  const root = document.documentElement;
  if (!root.getAttribute("data-theme")) {
    root.setAttribute("data-theme", "dark");
  }

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

  window.updateThemeToggleLabel = updateThemeToggleLabel;

  onReady(function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      updateThemeToggleLabel();

      btn.onclick = function () {
        const currentTheme = root.getAttribute("data-theme");
        root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
        updateThemeToggleLabel();
      };
    }

    window.addEventListener("localechange", updateThemeToggleLabel);
  });
})();

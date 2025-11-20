import { onReady } from "../utils/onReady";

(function () {
  const root = document.documentElement;
  if (!root.getAttribute("data-theme")) {
    root.setAttribute("data-theme", "light");
  }

  onReady(function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.onclick = function () {
        const currentTheme = root.getAttribute("data-theme");
        root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
      };
    }
  });
})();

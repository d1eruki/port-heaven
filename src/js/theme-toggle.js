(function () {
  // Устанавливаем тему до загрузки стилей и DOM
  const root = document.documentElement;
  if (!root.getAttribute("data-theme")) {
    root.setAttribute("data-theme", "dark");
  }

  // После загрузки DOM навешиваем обработчик на кнопку
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.onclick = function () {
        const currentTheme = root.getAttribute("data-theme");
        root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
      };
    }
  });
})();

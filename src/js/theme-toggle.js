document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;

  // Установим начальную тему, если не задана
  if (!root.getAttribute("data-theme")) {
    root.setAttribute("data-theme", "dark");
  }

  document.getElementById("theme-toggle").onclick = () => {
    const currentTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
  };
});

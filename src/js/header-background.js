(function () {
  const isLightTheme = document.documentElement.getAttribute("data-theme") === "light";
  const header = document.querySelector("header");

  if (!header || !isLightTheme) return;

  // Всегда включённые pointer-events, но header невидим по opacity
  header.style.opacity = "0";
  header.style.transition = "opacity 0.3s ease";

  let isHovered = false;

  const updateHeaderState = () => {
    const scrolled = window.scrollY > 0;

    if (scrolled || isHovered) {
      header.style.opacity = "1";
    } else {
      header.style.opacity = "0";
    }
  };

  // Hover отслеживается нормально, т.к. pointer-events не трогаем
  header.addEventListener("mouseenter", () => {
    isHovered = true;
    updateHeaderState();
  });

  header.addEventListener("mouseleave", () => {
    isHovered = false;
    updateHeaderState();
  });

  document.addEventListener("DOMContentLoaded", () => {
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState);
  });
})();

import i18n from "./i18n";

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#lang-toggle");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = i18n.global.locale.value;
      const next = current === "ru" ? "en" : "ru";
      i18n.global.locale.value = next;
      btn.src = next === "en" ? "assets/images/locales/ru.svg" : "assets/images/locales/en.svg";
    });
  });
});

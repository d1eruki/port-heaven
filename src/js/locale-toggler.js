import i18n from "./i18n";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = i18n.global.locale.value;
      i18n.global.locale.value = current === "ru" ? "en" : "ru";
      btn.textContent = current === "ru" ? "Русский" : "English";
    });
  }
});

import i18n from "../libraries/i18n";

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#lang-toggle");

  const setLabel = (el) => {
    const current = i18n.global.locale.value;
    el.textContent = current === "ru" ? "en" : "ru";
  };

  buttons.forEach((btn) => {
    setLabel(btn);
    btn.addEventListener("click", () => {
      const current = i18n.global.locale.value;
      i18n.global.locale.value = current === "ru" ? "en" : "ru";
      buttons.forEach(setLabel);
    });
  });
});

import i18n from "./i18n";

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#lang-toggle");

  // Initialize labels based on current locale: show the next language to switch to
  const setLabel = (el) => {
    const current = i18n.global.locale.value;
    el.textContent = current === "ru" ? "en" : "ru";
  };

  buttons.forEach((btn) => {
    setLabel(btn);
    btn.addEventListener("click", () => {
      const current = i18n.global.locale.value;
      i18n.global.locale.value = current === "ru" ? "en" : "ru";
      // After switching, update all toggles' labels to reflect the next available language
      buttons.forEach(setLabel);
    });
  });
});

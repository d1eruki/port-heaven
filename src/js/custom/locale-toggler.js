import i18n from "../libraries/i18n";
import { onReady } from "../utils/onReady";

onReady(() => {
  const buttons = document.querySelectorAll("#lang-toggle");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = i18n.global.locale.value;
      i18n.global.locale.value = current === "ru" ? "en" : "ru";
    });
  });
});

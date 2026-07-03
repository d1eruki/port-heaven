import i18n, { saveLocale, setDocumentLanguage } from "../libraries/i18n";
import { onReady } from "../utils/onReady";
import { DOM_SELECTORS } from "./dom-selectors";

export const initLocaleToggle = () =>
  onReady(() => {
    const buttons = document.querySelectorAll(DOM_SELECTORS.langToggle);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = i18n.global.locale.value;
        const next = current === "ru" ? "en" : "ru";
        i18n.global.locale.value = next;
        setDocumentLanguage(next);
        saveLocale(next);
        window.dispatchEvent(new Event("localechange"));
      });
    });
  });

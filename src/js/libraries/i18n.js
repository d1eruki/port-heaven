import { createI18n } from "vue-i18n";
import ru from "../../locales/ru.json";
import en from "../../locales/en.json";
import { typographMessages } from "./typograph";

const DEFAULT_LOCALE = "ru";

export const setDocumentLanguage = (locale) => {
  document.documentElement.lang = locale === "en" ? "en" : "ru";
};

setDocumentLanguage(DEFAULT_LOCALE);

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: "en",
  messages: {
    ru: typographMessages(ru),
    en: typographMessages(en),
  },
});

export default i18n;
export const t = (...args) => i18n.global.t(...args);

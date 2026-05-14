import { createI18n } from "vue-i18n";
import ru from "../../locales/ru.json";
import en from "../../locales/en.json";
import { typographMessages } from "./typograph";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "ru",
  fallbackLocale: "en",
  messages: {
    ru: typographMessages(ru),
    en: typographMessages(en),
  },
});

export default i18n;
export const t = (...args) => i18n.global.t(...args);

import { createI18n } from "vue-i18n";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "ru",
  fallbackLocale: "en",
  messages: { ru, en },
});

export default i18n;
export const t = (...args) => i18n.global.t(...args);

import { createI18n } from "vue-i18n";
import ru from "../../locales/ru.json";
import en from "../../locales/en.json";
import { readStorageValue, saveStorageValue } from "../utils/storage";
import { typographMessages } from "./typograph";

const DEFAULT_LOCALE = "ru";
const LOCALE_STORAGE_KEY = "locale";

const isSupportedLocale = (locale) => locale === "ru" || locale === "en";

const readSavedLocale = () =>
  readStorageValue({
    key: LOCALE_STORAGE_KEY,
    fallback: DEFAULT_LOCALE,
    isValid: isSupportedLocale,
  });

export const saveLocale = (locale) =>
  saveStorageValue({
    key: LOCALE_STORAGE_KEY,
    value: locale,
    isValid: isSupportedLocale,
  });

export const setDocumentLanguage = (locale) => {
  document.documentElement.lang = locale === "en" ? "en" : "ru";
};

const initialLocale = readSavedLocale();

setDocumentLanguage(initialLocale);

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: "ru",
  messages: {
    ru: typographMessages(ru),
    en: typographMessages(en),
  },
});

export default i18n;
export const t = (...args) => i18n.global.t(...args);

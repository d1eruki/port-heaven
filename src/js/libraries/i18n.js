import { createI18n } from "vue-i18n";
import ru from "../../locales/ru.json";
import en from "../../locales/en.json";
import { readStorageValue, saveStorageValue } from "../utils/storage";

const DEFAULT_LOCALE = "ru";
const LOCALE_STORAGE_KEY = "locale";
const localeMessages = { ru, en };
const localizedMetaTags = [
  ['meta[name="description"]', "description"],
  ['meta[property="og:title"]', "title"],
  ['meta[property="og:description"]', "description"],
  ['meta[property="og:image:alt"]', "imageAlt"],
];

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

export const applyDocumentLocale = (locale) => {
  const normalizedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const metadata = localeMessages[normalizedLocale].seo;

  document.documentElement.lang = normalizedLocale;
  document.title = metadata.title;

  localizedMetaTags.forEach(([selector, key]) => {
    document.querySelector(selector)?.setAttribute("content", metadata[key]);
  });
};

const initialLocale = readSavedLocale();

applyDocumentLocale(initialLocale);

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: "ru",
  messages: localeMessages,
});

export default i18n;
export const t = (...args) => i18n.global.t(...args);

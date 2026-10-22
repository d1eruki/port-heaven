import { createI18n } from "vue-i18n";
import { watch } from "vue";
import ru from "../../locales/ru.json";
import en from "../../locales/en.json";
import { useValidatedStorage } from "../features/preferences/storage";

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
const savedLocale = useValidatedStorage({
  key: LOCALE_STORAGE_KEY,
  fallback: DEFAULT_LOCALE,
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

const initialLocale = savedLocale.value;

applyDocumentLocale(initialLocale);

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: "ru",
  messages: localeMessages,
});

watch(savedLocale, (locale) => {
  if (i18n.global.locale.value !== locale) i18n.global.locale.value = locale;
  applyDocumentLocale(locale);
});

watch(
  i18n.global.locale,
  (locale) => {
    const normalizedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
    if (savedLocale.value !== normalizedLocale) savedLocale.value = normalizedLocale;
    applyDocumentLocale(normalizedLocale);
  },
  { flush: "sync" },
);

export default i18n;
export const t = (...args) => i18n.global.t(...args);

import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        welcome: 'Welcome',
        description: 'This is a sample text.',
        changeLanguage: 'Switch to Russian',
    },
    ru: {
        welcome: 'Добро пожаловать',
        description: 'Это пример текста.',
        changeLanguage: 'Переключить на английский',
    },
};

const i18n = createI18n({
    locale: 'ru', // язык по умолчанию
    fallbackLocale: 'ru', // язык, используемый, если перевод отсутствует
    messages,
});

export default i18n;

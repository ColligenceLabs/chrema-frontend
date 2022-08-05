import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import ko from './locales/kr';

const language = window.localStorage.getItem('cur_language') || 'en';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en,
      ko,
    },
    lng: language,
    fallbackLng: {
      en: ['en'],
      default: ['ko'],
    },
    // debug: true,
    defaultNS: 'translation',
    ns: 'translation',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .then();

export default i18n;

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import pt from './locales/pt'

const resources = {
  en: { translation: en },
  pt: { translation: pt },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

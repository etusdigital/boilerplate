import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'
import { useMainStore } from '../stores'
import { watch } from 'vue'

const mainStore = useMainStore()

const i18n = createI18n({
  locale: mainStore.currentLanguage,
  fallbackLocale: 'pt',
  messages: {
    en,
    pt,
  },
})

// Watch for changes in the currentLanguage and update the locale
watch(
  () => mainStore.currentLanguage,
  (newLocale) => {
    i18n.global.locale = newLocale
  },
)

export default i18n

import DesignSystem from '@etus/design-system'
import '@etus/design-system/styles.css'
import { useMainStore } from '@/app/stores'

import { createApp, watch, computed } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth0 } from './auth/index'
import i18n from './languages/i18n'
const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(DesignSystem)
app.use(auth0)

const store = useMainStore()

const isLoading = computed(() => store.isLoading)
let isMounted = false

watch(isLoading, (newValue: boolean) => {
  if (!newValue && !isMounted) {
    isMounted = true
    app.use(router)
    app.mount('#app')
  }
})

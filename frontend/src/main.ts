import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DesignSystem from '@BRIUS/design-system'
import '@BRIUS/design-system/styles.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(DesignSystem)

app.mount('#app')

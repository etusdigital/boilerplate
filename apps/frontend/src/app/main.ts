import DesignSystem from '@BRIUS/design-system'
import '@BRIUS/design-system/styles.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth0 } from './auth/index'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(DesignSystem)
app.use(auth0)

app.mount('#app')

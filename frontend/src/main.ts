import DesignSystem from '@BRIUS/design-system'
import '@BRIUS/design-system/styles.css'
import './assets/main.css'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth0 } from './Auth/index'
const app = createApp(App)
const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user: authUser,
  } = await auth0;

watch(authUser, async newValue => {
  console.log('authUser', isAuthenticated.value,
    isLoading,
    loginWithRedirect,
    logout,
    authUser.value)
  if (isAuthenticated.value && authUser.value) {
    const email = authUser.value.email
    if (email && !email.includes('@brius.com.br')) {
      console.log('logout')
      //logout()
    }
  } else {
    console.log('loginWithRedirect')
    loginWithRedirect()
  }
});
console.log('user', auth0);

app.use(createPinia())
app.use(router)
app.use(DesignSystem)
app.use(auth0)  

app.mount('#app')

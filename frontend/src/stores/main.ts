import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { User as Auth0User } from '@auth0/auth0-vue'

import { useAuth0 } from '@auth0/auth0-vue'

const {
  isAuthenticated,
  isLoading,
  loginWithRedirect,
  logout,
  user: auth0User,
} = useAuth0()

watch(auth0User, async newValue => {
  if (isAuthenticated.value && auth0User.value) {
    const email = auth0User.value.email;
    setUser(auth0User.value)
  } else {
    loginWithRedirect()
  }
});

const setUser = (user: Auth0User) => {
  user.value = user
}


export const useMainStore = defineStore('main', () => {
  return {
    user: auth0User.value,
  }
})

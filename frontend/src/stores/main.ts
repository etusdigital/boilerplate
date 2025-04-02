import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { auth0 } from '../Auth/index'
const {
  isAuthenticated,
  isLoading,
  loginWithRedirect,
  logout,
  user: authUser,
} = await auth0;

const user = ref({});

watch(authUser, async newValue => {
  if (isAuthenticated.value && authUser.value) {
    user.value = authUser.value;
    const email = authUser.value.email
    if (email && !email.includes('@brius.com.br')) {
      console.log('logout')
      //logout()
    }
  } else {
    console.log('loginWithRedirect')
      user.value = {
        name: 'clovis',
        email: 'clovis@gmail.com',
        role: 'admin',
        token: '1234567890',
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
        deletedAt: null,
        id: 1,
      }
      //loginWithRedirect()
    }
  });
console.log('user', auth0);

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      loading: true,
      isAuthenticated: true,
      user,
      permissions: [],
      accessToken: null,
      toastOptions:  {
        timeout: 3500,
        type: 'error',
        top: true,
        right: true,
      }
    }
},
})

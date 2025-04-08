import { ref, computed, watch, reactive } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { auth0 } from '../auth/index'
import axios from 'axios'
const { isAuthenticated, loginWithRedirect, logout, user: authUser, getAccessTokenSilently } = auth0

const user = ref({})
const isLoading: Ref<boolean> = ref(true)
const selectedAccount = reactive({})

watch(authUser, async (newValue) => {
  if (isAuthenticated.value && authUser.value) {
    user.value = authUser.value
    const email = authUser.value.email || ''
    if (email) {
      Object.assign(user.value, await getLogin(email))
      user.value.roles = user.value[import.meta.env.VITE_AUTH0_ROLES_NAME] || []
      user.value.isAdmin = user.value.roles.includes('master-admin') || user.value.roles.includes('admin')
      getSelectedAccount()
      endLoading()
    }
  } else {
    user.value = {}
    loginWithRedirect()
  }
})

const getLogin = async (email: string) => {
  const accessToken = await getAccessTokenSilently()
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/users/login`,
    { email },
    {
      headers: {
        'account-id': 1,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}

const getSelectedAccount = async (): Promise<Account> => {
  if (window.localStorage) {
    const found = window.localStorage.getItem('selected_account')
    try {
      if (found) {
        return Object.assign(
          selectedAccount,
          user.value.userAccounts.find((account) => account.account.id == found).account,
        )
      }
    } catch (error) {}
  }

  return Object.assign(selectedAccount, user.value?.userAccounts[0].account || {})
}

const endLoading = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const changeAccount = (accountId: string) => {
  isLoading.value = true
  if (window.localStorage) {
    window.localStorage.setItem('selected_account', accountId)
  }
  endLoading()
  return getSelectedAccount()
}

export const useMainStore = defineStore('main', () => {
  return {
    isLoading: isLoading,
    user,
    toastOptions: {
      timeout: 3500,
      type: 'danger',
      top: true,
      right: true,
    },
    selectedAccount,
    logout,
    getAccessTokenSilently,
    changeAccount,
  }
})

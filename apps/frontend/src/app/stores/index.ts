import { ref, watch, reactive, nextTick } from 'vue'
import type { Ref } from 'vue'
import { defineStore, type StoreDefinition } from 'pinia'
import { auth0 } from '../auth/index'
import axios from 'axios'
import type { User } from '@/features/users/types/user.type'
import type { Account } from '@/features/accounts/types/account.type'

const { isAuthenticated, loginWithRedirect, logout, user: authUser, getAccessTokenSilently } = auth0

const user = ref<User>({} as User)
const isLoading: Ref<boolean> = ref(true)
const currentLanguage = ref('pt')
const selectedAccount = reactive({})

getSavedLanguage()

watch(authUser, async () => {
  if (isAuthenticated.value && authUser.value) {
    user.value = {
      ...authUser.value,
      name: authUser.value.name || '',
      email: authUser.value.email || '',
      roles: authUser.value.roles || [],
      isAdmin: authUser.value.roles?.includes('master-admin') || authUser.value.roles?.includes('admin') || false,
    }
    const email = authUser.value.email || ''
    if (!email) return

    Object.assign(user.value, await getLogin(email))

    // Ensure VITE_AUTH0_ROLES_NAME is a string
    const rolesName = import.meta.env.VITE_AUTH0_ROLES_NAME as string
    user.value.roles = (user.value as any)[rolesName] || []
    user.value.isAdmin = user.value.roles?.includes('master-admin') || user.value.roles?.includes('admin') || false
    getSelectedAccount()
    endLoading()
  } else {
    user.value = {} as User
    loginWithRedirect()
  }
})

async function getLogin(email: string) {
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

async function getSelectedAccount(): Promise<Account> {
  if (window.localStorage) {
    const found = window.localStorage.getItem('selected_account')
    try {
      if (!found) return {} as Account

      return Object.assign(
        selectedAccount,
        user.value.userAccounts?.find((account: any) => account.account.id == found)?.account || ({} as Account),
      )
    } catch (error) {}
  }

  return Object.assign(selectedAccount, user.value?.userAccounts?.[0]?.account || ({} as Account))
}

function endLoading() {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

function changeAccount(accountId: string) {
  isLoading.value = true
  if (window.localStorage) window.localStorage.setItem('selected_account', accountId)

  endLoading()
  return getSelectedAccount()
}

function getSavedLanguage() {
  if (!window.localStorage) return

  const savedLanguage = window.localStorage.getItem('app_lang')
  if (savedLanguage) currentLanguage.value = savedLanguage
}

function saveLanguage(language: string) {
  if (!window.localStorage) return
  window.localStorage.setItem('app_lang', language)
  currentLanguage.value = language
}

function setLanguage(language: string) {
  isLoading.value = true

  saveLanguage(language)
  nextTick(() => {
    isLoading.value = false
  })
}

export const useMainStore: StoreDefinition = defineStore('main', () => {
  return {
    isLoading: isLoading,
    user: user,
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
    currentLanguage,
    setLanguage,
  }
})

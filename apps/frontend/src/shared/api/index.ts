import axios from 'axios'
import { useMainStore } from '@/app/stores'

const mainStore = useMainStore()

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const accessToken = await mainStore.getAccessTokenSilently()
  config.headers['account-id'] = mainStore.selectedAccount.id
  config.headers['Authorization'] = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default api

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useMainStore } from '../stores/mainStore'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let getAccessToken: (() => Promise<string>) | null = null

export function setupInterceptors(getToken: () => Promise<string>) {
  getAccessToken = getToken
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getAccessToken) {
      try {
        const token = await getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Failed to get access token:', error)
      }
    }

    const selectedAccount = useMainStore.getState().selectedAccount
    if (selectedAccount) {
      config.headers['account-id'] = selectedAccount.id.toString()
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response
      console.error(`API Error ${status}:`, data)
    } else if (error.request) {
      console.error('Network error - No response received')
    } else {
      console.error('Request setup error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient

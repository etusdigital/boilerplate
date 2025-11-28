import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useMainStore } from './store'

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let getAccessToken: (() => Promise<string>) | null = null

export function setupInterceptors(getToken: () => Promise<string>) {
  getAccessToken = getToken
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('[api-client] Interceptor - making request to:', config.url)

    // Add auth token
    if (getAccessToken) {
      try {
        const token = await getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('[api-client] Added Authorization header')
        } else {
          console.warn('[api-client] No token returned from getAccessToken')
        }
      } catch (error) {
        console.error('[api-client] Failed to get access token:', error)
      }
    } else {
      console.warn('[api-client] getAccessToken not configured yet')
    }

    // Add account-id header from Zustand store
    const selectedAccount = useMainStore.getState().selectedAccount
    if (selectedAccount) {
      config.headers['account-id'] = selectedAccount.id
      console.log('[api-client] Added account-id header:', selectedAccount.id)
    } else {
      console.log('[api-client] No selected account in store')
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
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

export default api

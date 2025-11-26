import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptors for auth token if needed
api.interceptors.request.use((config) => {
  // Add auth token from cookie or session if needed
  return config
})

export default api

'use client'

import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { setupInterceptors } from '../_lib/api-client'
import { useMainStore } from '../_lib/store'
import api from '../_lib/api-client'

interface User {
  id: string
  name: string
  email: string
  profileImage?: string
  picture?: string
  isSuperAdmin: boolean
  userAccounts: Array<{
    account: {
      id: string
      name: string
      domain: string
    }
    role: string
  }>
}

/**
 * AppInitializer Component
 *
 * Client component that initializes the application:
 * - Sets up axios interceptors with Auth0 token
 * - Loads user data from backend
 * - Populates Zustand store with user and accounts
 * - Manages loading state
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading } = useUser()
  const { setUser, setLoading, isLoading } = useMainStore()

  useEffect(() => {
    // Setup interceptors with Auth0 getAccessToken from client SDK
    if (typeof window !== 'undefined') {
      setupInterceptors(async () => {
        try {
          // Get token directly from browser (Auth0 SDK stores it)
          const response = await fetch('/api/auth/token')
          if (response.ok) {
            const { accessToken } = await response.json()
            if (accessToken) {
              return accessToken
            }
          }

          // Fallback: if API route fails, return empty string
          // The /users/login endpoint doesn't strictly require account-id
          // so it can work with just the JWT from Auth0
          console.warn('Could not get access token from API route')
          return ''
        } catch (error) {
          console.error('Failed to fetch access token:', error)
          return ''
        }
      })
    }
  }, [])

  useEffect(() => {
    async function loadUserData() {
      if (auth0Loading || !auth0User) {
        return
      }

      try {
        setLoading(true)

        // Login/fetch user data from backend using Auth0 email
        const response = await api.post<User>('/users/login', {
          email: auth0User.email,
        })

        // Set user in store (will auto-set selectedAccount)
        setUser(response.data)
      } catch (error) {
        console.error('[AppInitializer] Failed to load user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [auth0User, auth0Loading, setUser, setLoading])

  // Show loading state while initializing
  if (auth0Loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

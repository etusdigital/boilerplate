import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useMainStore } from '../stores/mainStore'
import { api } from '../api'

function HomePage() {
  const { isAuthenticated, isLoading: authLoading, user: auth0User } = useAuth0()
  const { user, isLoading, setUser, setIsLoading } = useMainStore()

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !user && !authLoading && auth0User?.email) {
        try {
          setIsLoading(true)
          const userData = await api.post('/users/login', { email: auth0User.email })
          setUser(userData)
        } catch (error) {
          console.error('Error logging in user:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserData()
  }, [isAuthenticated, user, authLoading, auth0User, setUser, setIsLoading])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Etus Boilerplate - React
        </h1>

        {isAuthenticated && user ? (
          <div>
            <p className="text-xl text-gray-600 mb-8">
              Welcome, {user.name}! 🎉
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ Auth0 authenticated</p>
              <p>✅ User data loaded</p>
              <p>✅ {user.accounts?.length || 0} account(s) available</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xl text-gray-600 mb-8">
              Phase 4 Complete - Auth0 Working!
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ Auth0 configured</p>
              <p>✅ Login/Logout ready</p>
              <p>✅ Click "Login" to authenticate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

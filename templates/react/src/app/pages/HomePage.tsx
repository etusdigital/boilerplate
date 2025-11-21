import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'
import { useMainStore } from '../stores/mainStore'
import { api } from '../api'

function HomePage() {
  const { isAuthenticated, isLoading: authLoading, user: auth0User } = useAuth0()
  const { t } = useTranslation()
  const { user, isLoading, setUser, setLoading } = useMainStore()

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !user && !authLoading && auth0User?.email) {
        try {
          setLoading(true)
          const userData = await api.post('/users/login', { email: auth0User.email })
          setUser(userData)
        } catch (error) {
          console.error('Error logging in user:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [isAuthenticated, user, authLoading, auth0User, setUser, setLoading])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600">{t('common.loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('home.title')}
        </h1>

        {isAuthenticated && user ? (
          <div>
            <p className="text-xl text-gray-600 mb-8">
              {t('home.subtitle', { name: user.name })} 🎉
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ {t('auth.authenticated')}</p>
              <p>✅ {t('auth.userDataLoaded')}</p>
              <p>✅ {t('auth.accountsAvailable', { count: user.userAccounts?.length || 0 })}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xl text-gray-600 mb-8">
              {t('home.phaseComplete', { number: 7 })} - i18n Working!
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ Auth0 configured</p>
              <p>✅ Login/Logout ready</p>
              <p>✅ {t('auth.clickToLogin')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

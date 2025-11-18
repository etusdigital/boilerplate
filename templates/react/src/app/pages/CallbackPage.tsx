import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function CallbackPage() {
  const { isAuthenticated, error, isLoading } = useAuth0()
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Redirect to home after successful authentication
      navigate('/')
    }
  }, [isAuthenticated, isLoading, navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {t('auth.authenticationError')}
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('auth.returnToHome')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('auth.processingLogin')}
        </h2>
        <p className="text-gray-600">{t('auth.pleaseWait')}</p>
      </div>
    </div>
  )
}

export default CallbackPage

import { Outlet, Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'
import { useMainStore } from '../stores/mainStore'

function Layout() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const { t, i18n } = useTranslation()
  const user = useMainStore((state) => state.user)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-lg font-bold text-gray-900">
                {t('common.appName')}
              </Link>
              {isAuthenticated && (
                <div className="flex space-x-4">
                  <Link
                    to="/users"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t('navigation.users')}
                  </Link>
                  <Link
                    to="/accounts"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t('navigation.accounts')}
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t('navigation.settings')}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Switch language"
              >
                {i18n.language === 'pt' ? 'EN' : 'PT'}
              </button>

              {isAuthenticated && user ? (
                <>
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button
                    onClick={() =>
                      logout({ logoutParams: { returnTo: window.location.origin } })
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {t('common.login')}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

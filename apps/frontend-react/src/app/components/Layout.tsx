import { Outlet, Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useMainStore } from '../stores/mainStore'

function Layout() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const user = useMainStore((state) => state.user)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-lg font-bold text-gray-900">
                Etus Boilerplate
              </Link>
              {isAuthenticated && (
                <div className="flex space-x-4">
                  <Link
                    to="/users"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Users
                  </Link>
                  <Link
                    to="/accounts"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Accounts
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Settings
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button
                    onClick={() =>
                      logout({ logoutParams: { returnTo: window.location.origin } })
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Login
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

import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-lg font-bold text-gray-900">
              Etus Boilerplate
            </Link>
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

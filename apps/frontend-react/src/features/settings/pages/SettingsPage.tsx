import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface SettingsCard {
  label: string
  icon: string
  path: string
  description: string
}

function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const settingsRoutes: SettingsCard[] = [
    {
      label: t('navigation.users'),
      icon: 'group',
      path: '/users',
      description: t('users.description'),
    },
    {
      label: t('navigation.accounts'),
      icon: 'corporate_fare',
      path: '/accounts',
      description: t('accounts.description'),
    },
  ]

  const handleCardClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('settings.title')}
        </h1>

        <div className="grid gap-6 mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {settingsRoutes.map((route) => (
            <div
              key={route.path}
              onClick={() => handleCardClick(route.path)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-icons text-4xl text-blue-600">
                    {route.icon}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {route.label}
                  </h2>
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <p className="text-gray-600 text-sm">{route.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

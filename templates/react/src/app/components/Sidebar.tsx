import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface MenuItem {
  path: string
  label: string
  icon: string
}

export function Sidebar() {
  const { t } = useTranslation()

  const menuItems: MenuItem[] = [
    { path: '/', label: t('navigation.home'), icon: 'home' },
    { path: '/users', label: t('navigation.users'), icon: 'people' },
    { path: '/accounts', label: t('navigation.accounts'), icon: 'business' },
    { path: '/settings', label: t('navigation.settings'), icon: 'settings' },
  ]

  return (
    <aside className="sticky top-16 w-70 h-[calc(100vh-4rem)] border-r bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                'hover:bg-gray-100',
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700'
              )
            }
          >
            <span className="material-icons text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

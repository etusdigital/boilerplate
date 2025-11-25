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
    { path: '/settings', label: t('navigation.settings'), icon: 'settings' },
    { path: '/accounts', label: t('navigation.accounts'), icon: 'business' },
  ]

  return (
    <aside className="sticky top-16 w-43 h-[calc(100vh-4rem)] border-r border-border py-md px-sm bg-background">
      <nav className="flex flex-col gap-base">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground'
              )
            }
          >
            <span className="material-symbols-rounded text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

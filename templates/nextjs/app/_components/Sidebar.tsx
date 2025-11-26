'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { cn } from '@boilerplate/ui-react'

interface MenuItem {
  path: string
  label: string
  icon: string
}

export function Sidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const mainMenuItems: MenuItem[] = [
    { path: '/', label: t('navigation.home'), icon: 'home' },
    { path: '/users', label: t('navigation.users'), icon: 'people' },
    { path: '/accounts', label: t('navigation.accounts'), icon: 'business' },
  ]

  const bottomMenuItem: MenuItem = {
    path: '/settings',
    label: t('navigation.settings'),
    icon: 'settings'
  }

  return (
    <aside className="sticky top-16 w-43 h-[calc(100vh-4rem)] border-r border-border py-md px-sm bg-white">
      <nav className="flex flex-col h-full">
        <div className="flex flex-col gap-base">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center gap-2 px-2 py-3 rounded-sm text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary-active text-primary'
                    : 'text-foreground'
                )}
              >
                <span className="material-symbols-rounded text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Settings at the bottom */}
        <div className="mt-auto pt-md">
          <Link
            href={bottomMenuItem.path}
            className={cn(
              'flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              pathname === bottomMenuItem.path
                ? 'bg-primary-active text-primary'
                : 'text-foreground'
            )}
          >
            <span className="material-symbols-rounded text-xl">{bottomMenuItem.icon}</span>
            <span>{bottomMenuItem.label}</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}

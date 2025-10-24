import type { Route } from '@/shared/types/Route'

export const settingsRoutes: Route[] = [
  {
    path: '/settings',
    name: 'Settings',
    icon: 'settings',
    bottom: true,
    component: () => import('./views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'settings.settings',
      adminOnly: true,
    },
  },
  // e.g., /products/new, /products/:id/edit
]

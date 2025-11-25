import type { Route } from '@/shared/types/Route'

export const settingsRoutes: Route[] = [
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'settings.settings',
      icon: 'settings',
      adminOnly: true,
      bottom: true,
    },
  },
  // e.g., /products/new, /products/:id/edit
]

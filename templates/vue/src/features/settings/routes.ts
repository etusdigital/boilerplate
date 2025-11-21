import type { Route } from '@/shared/types/Route'

export const settingsRoutes: Route[] = [
  {
    path: '/settings',
    name: 'Settings',
    bottom: true,
    component: () => import('./views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'settings.settings',
      icon: 'settings',
      adminOnly: true,
    },
  },
  // e.g., /products/new, /products/:id/edit
]

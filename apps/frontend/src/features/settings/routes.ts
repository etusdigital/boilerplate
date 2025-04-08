import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Settings',
      adminOnly: true,
    },
  },
  // e.g., /products/new, /products/:id/edit
]

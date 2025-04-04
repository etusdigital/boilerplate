import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'Settings', // Unique name for the route
    component: () => import('./views/SettingsView.vue'), // Lazy-loaded view
    meta: {
      // Example meta fields (optional)
      requiresAuth: true,
      title: 'Settings',
      adminOnly: true,
    },
  },
  // Add other product-related routes here if needed
  // e.g., /products/new, /products/:id/edit
]

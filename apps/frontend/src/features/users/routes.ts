import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'Users',
    component: () => import('./views/UsersView.vue'), // Lazy-loaded view
    meta: {
      // Example meta fields (optional)
      requiresAuth: true,
      title: 'Users',
      adminOnly: true,
    },
  },
]

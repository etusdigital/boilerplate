import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'Users', // Unique name for the route
    component: () => import('./views/UsersView.vue'), // Lazy-loaded view
    meta: {
      // Example meta fields (optional)
      requiresAuth: true,
      title: 'users.users',
      icon: 'group',
      adminOnly: true,
    },
  },
  // Add other product-related routes here if needed
  // e.g., /products/new, /products/:id/edit
]

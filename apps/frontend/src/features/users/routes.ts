import type { Route } from '@/shared/types/Route'

export const userRoutes: Route[] = [
  {
    path: '/users',
    name: 'Users', // Unique name for the route
    icon: 'group',
    component: () => import('./views/UsersView.vue'), // Lazy-loaded view
    meta: {
      // Example meta fields (optional)
      requiresAuth: true,
      title: 'users.users',
      adminOnly: true,
    },
  },
  // Add other product-related routes here if needed
  // e.g., /products/new, /products/:id/edit
]

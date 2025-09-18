import type { Route } from '@/shared/types/Route'

export const accountRoutes: Route[] = [
  {
    path: '/accounts',
    name: 'Accounts',
    icon: 'domain',
    component: () => import('./views/AccountsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'accounts.accounts',
      adminOnly: true,
    },
  },
]

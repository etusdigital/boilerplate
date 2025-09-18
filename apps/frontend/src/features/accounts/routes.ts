import type { RouteRecordRaw } from 'vue-router'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('./views/AccountsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'accounts.accounts',
      icon: 'domain',
      adminOnly: true,
    },
  },
]

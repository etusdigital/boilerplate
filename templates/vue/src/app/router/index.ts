import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { createPinia } from 'pinia'
import { useMainStore } from '../stores'
import { userRoutes } from '@/features/users/index'
import { settingsRoutes } from '@/features/settings'
import { accountRoutes } from '@/features/accounts/index'

import HomeView from '@/app/views/HomeView.vue'
import Callback from '@/app/views/Callback.vue'
import NotFoundView from '@/app/views/NotFoundView.vue'

const pinia = createPinia()
useMainStore(pinia)

// --- Define Core App Routes ---
const coreAppRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      icon: 'home',
      title: 'home',
    },
  },
  {
    path: '/callback',
    name: 'callback',
    component: () => Callback,
  },
  // Add other core app routes like /about, /contact if they don't belong to a feature
]

// --- Define Catch-all Route (404 Not Found) ---
// IMPORTANT: This should usually be the LAST route in the array
const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*', // Matches everything that wasn't caught by earlier routes
  name: 'NotFound',
  component: NotFoundView,
  meta: {
    title: 'Page Not Found',
  },
}

export const routes: RouteRecordRaw[] = [
  ...coreAppRoutes,
  ...userRoutes,
  ...settingsRoutes,
  ...accountRoutes,
  notFoundRoute, // Catch-all route MUST be last
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
})

// Route Guard
router.beforeEach((to, from, next) => {
  // const isAdmin = store.user.isAdmin
  const isAdmin = true

  if (to.meta.adminOnly && !isAdmin) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router

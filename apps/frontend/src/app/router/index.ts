import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/app/views/HomeView.vue'
import Callback from '@/app/views/Callback.vue'
import NotFoundView from '@/app/views/NotFoundView.vue'

import { userRoutes } from '@/features/users'

// --- Define Core App Routes ---
const coreAppRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Welcome Home',
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

const routes: RouteRecordRaw[] = [
  ...coreAppRoutes,
  ...userRoutes, // Add users feature routes
  notFoundRoute, // Catch-all route MUST be last
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

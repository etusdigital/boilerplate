import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { userRoutes } from '@/features/users'
import { accountRoutes } from '@/features/accounts'
import { settingsRoutes } from '@/features/settings'
import HomePage from '../pages/HomePage'
import CallbackPage from '../pages/CallbackPage'
import NotFoundPage from '../pages/NotFoundPage'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'

const wrapWithProtectedRoute = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => ({
    ...route,
    element: <ProtectedRoute>{route.element}</ProtectedRoute>,
  }))
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...wrapWithProtectedRoute(userRoutes),
      ...wrapWithProtectedRoute(accountRoutes),
      ...wrapWithProtectedRoute(settingsRoutes),
    ],
  },
  {
    path: '/callback',
    element: <CallbackPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router

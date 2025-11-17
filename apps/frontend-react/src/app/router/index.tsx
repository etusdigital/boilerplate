import { createBrowserRouter } from 'react-router-dom'
import { userRoutes } from '@/features/users'
import { accountRoutes } from '@/features/accounts'
import { settingsRoutes } from '@/features/settings'
import HomePage from '../pages/HomePage'
import CallbackPage from '../pages/CallbackPage'
import NotFoundPage from '../pages/NotFoundPage'
import Layout from '../components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...userRoutes,
      ...accountRoutes,
      ...settingsRoutes,
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

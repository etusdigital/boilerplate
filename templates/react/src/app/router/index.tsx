import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import HomePage from '../pages/HomePage'
import CallbackPage from '../pages/CallbackPage'
import NotFoundPage from '../pages/NotFoundPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { AccountsPage } from '@/features/accounts/pages/AccountsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

const router = createBrowserRouter([
  {
    path: '/callback',
    element: <CallbackPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router

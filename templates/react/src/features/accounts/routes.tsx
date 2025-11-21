import { RouteObject } from 'react-router-dom'
import AccountsPage from './pages/AccountsPage'

const accountRoutes: RouteObject[] = [
  {
    path: '/accounts',
    element: <AccountsPage />,
  },
]

export default accountRoutes

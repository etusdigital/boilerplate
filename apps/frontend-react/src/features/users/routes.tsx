import { RouteObject } from 'react-router-dom'
import UsersPage from './pages/UsersPage'

const userRoutes: RouteObject[] = [
  {
    path: '/users',
    element: <UsersPage />,
  },
]

export default userRoutes

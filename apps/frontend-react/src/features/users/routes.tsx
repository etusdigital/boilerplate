import { RouteObject } from 'react-router-dom'

const UsersPage = () => <div>Users Page - Coming in Phase 8</div>

const userRoutes: RouteObject[] = [
  {
    path: '/users',
    element: <UsersPage />,
  },
]

export default userRoutes

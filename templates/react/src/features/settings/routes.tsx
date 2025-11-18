import { RouteObject } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'

const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <SettingsPage />,
  },
]

export default settingsRoutes

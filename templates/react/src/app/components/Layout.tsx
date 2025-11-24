import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useMainStore } from '../stores/mainStore'
import { api } from '../api'

export function Layout() {
  const { isAuthenticated, isLoading: authLoading, user: auth0User } = useAuth0()
  const { user, setUser, setLoading } = useMainStore()

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !user && !authLoading && auth0User?.email) {
        try {
          setLoading(true)
          const userData = await api.post('/users/login', { email: auth0User.email })
          setUser(userData)
        } catch (error) {
          console.error('Error loading user data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [isAuthenticated, user, authLoading, auth0User, setUser, setLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-muted-foreground">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          <div className="main-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  console.log('🔒 ProtectedRoute:', { isAuthenticated, isLoading })

  if (isLoading) {
    console.log('⏳ Auth0 loading...')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to Auth0...')
    loginWithRedirect()
    return null
  }

  console.log('✅ Authenticated, rendering children')
  return <>{children}</>
}

export default ProtectedRoute

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import router from './router'
import { setupInterceptors } from './api/client'

function App() {
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    setupInterceptors(getAccessTokenSilently)
  }, [getAccessTokenSilently])

  return <RouterProvider router={router} />
}

export default App

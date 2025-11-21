import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Toaster } from 'sonner'
import router from './router'
import { setupInterceptors } from './api/client'

function App() {
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    setupInterceptors(getAccessTokenSilently)
  }, [getAccessTokenSilently])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App

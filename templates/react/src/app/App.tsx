import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Toaster } from 'sonner'
import router from './router'
import { setupInterceptors } from './api/client'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    setupInterceptors(getAccessTokenSilently)
  }, [getAccessTokenSilently])

  return (
    <ThemeProvider defaultTheme="light">
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}

export default App

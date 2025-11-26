import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { AuthProvider } from './app/auth'
import './app/i18n'
import '@boilerplate/ui-react/styles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

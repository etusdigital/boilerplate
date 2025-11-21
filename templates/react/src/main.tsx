import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { AuthProvider } from './app/auth'
import './app/i18n'
import './app/assets/main.css'

console.log('🚀 Main.tsx loading...')
console.log('📍 Root element:', document.getElementById('root'))
console.log('🔑 Auth0 Config:', {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ? '✅ Set' : '❌ Missing',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
})

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
  console.log('✅ React app rendered')
} catch (error) {
  console.error('❌ Error rendering app:', error)
}

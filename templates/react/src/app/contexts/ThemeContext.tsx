import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'app-theme'

/**
 * Updates the document to apply the theme
 * Light mode is the default (no class), dark mode adds 'dark' class
 */
function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

/**
 * Theme Provider Component
 *
 * Manages theme state and persistence.
 * Supports two modes:
 * - 'light': Light mode
 * - 'dark': Dark mode
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load from localStorage, fallback to default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored && ['light', 'dark'].includes(stored)) {
        return stored
      }
    }
    return defaultTheme
  })

  // Apply theme immediately on mount and when it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Apply theme on initial mount to ensure it's set
  useEffect(() => {
    applyTheme(theme)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access and control theme
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme()
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current: {theme}
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

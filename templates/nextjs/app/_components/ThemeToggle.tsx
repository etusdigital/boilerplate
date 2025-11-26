'use client'

import { useTheme } from 'next-themes'
import { Button } from '@boilerplate/ui-react'

/**
 * Theme Toggle Component
 *
 * Toggles between light and dark themes using next-themes
 * Shows sun icon in dark mode, moon icon in light mode
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-9 w-9"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <span className="material-symbols-rounded">dark_mode</span>
      ) : (
        <span className="material-symbols-rounded">light_mode</span>
      )}
    </Button>
  )
}

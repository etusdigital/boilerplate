import { useTheme } from '../contexts/ThemeContext'
import { Button } from '@/components/ui/button'

/**
 * Theme Toggle Component
 *
 * Cycles through theme options: light → dark → system
 * Shows appropriate icon for current theme
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const next = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    } as const
    setTheme(next[theme])
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return 'light_mode'
      case 'dark':
        return 'dark_mode'
      case 'system':
        return 'brightness_auto'
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      case 'system':
        return 'System theme'
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9"
      title={getLabel()}
      aria-label={getLabel()}
    >
      <span className="material-symbols-rounded text-[20px]">
        {getIcon()}
      </span>
    </Button>
  )
}

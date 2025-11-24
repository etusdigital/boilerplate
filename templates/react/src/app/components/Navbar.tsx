import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMainStore } from '../stores/mainStore'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { logout, user: authUser } = useAuth0()
  const { t, i18n } = useTranslation()
  const { user, userAccounts, selectedAccount, changeAccount } = useMainStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleAccountChange = (accountId: string) => {
    changeAccount(accountId)
    // Navigate to home to reload data for new account context
    if (location.pathname !== '/') {
      navigate('/')
    } else {
      // If already on home, force reload by navigating to self
      navigate('/', { replace: true })
      window.location.reload()
    }
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <TooltipProvider>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between p-lg">
          {/* Left Section: Logo + Divider + Account Selector */}
          <div className="flex items-center gap-base">
            {/* Logo */}
            <div className="flex items-center gap-4 text-lg leading-lg font-light">
              <img src="/etus-logo.png" alt="Logo" className="h-xl w-xl" />
              <span className="text-lg font-bold" style={{ color: 'rgb(24, 77, 59)' }}>Boilerplate</span>
            </div>

            {/* Divider */}
            <div className="border-r border-border h-lg" />

            {/* Account Selector */}
            <div className="flex items-center gap-4">
              <Select value={selectedAccount?.id} onValueChange={handleAccountChange}>
                <SelectTrigger className="h-11 min-w-[20em] text-muted-foreground shadow-none">
                  <SelectValue placeholder={t('navbar.selectAccount')} />
                </SelectTrigger>
                <SelectContent>
                  {userAccounts?.map((ua) => (
                    <SelectItem key={ua.account.id} value={ua.account.id}>
                      {ua.account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Section: Language Selector + User Profile */}
          <div className="flex items-center gap-base">
            {/* Language Selector */}
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-11 min-w-[22em] text-muted-foreground shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>

            {/* Theme Toggle - Hidden temporarily */}
            <div className="hidden">
              <ThemeToggle />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-sm">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profileImage || user?.picture || authUser?.picture} alt={user?.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(user?.name || authUser?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col mr-base">
                <span className="text-sm font-bold">{user?.name}</span>
                <span className="text-sm leading-tight">{user?.email}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-8 w-8"
                  >
                    <span className="material-symbols-rounded">logout</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t('common.logout')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  )
}

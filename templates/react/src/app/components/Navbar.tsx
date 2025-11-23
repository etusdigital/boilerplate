import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMainStore } from '../stores/mainStore'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { logout, user: authUser } = useAuth0()
  const { t, i18n } = useTranslation()
  const { user, userAccounts, selectedAccount, changeAccount } = useMainStore()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleAccountChange = (accountId: string) => {
    changeAccount(accountId)
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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 gap-3">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="/etus-logo.ico" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-brand">Boilerplate</span>
        </div>

        {/* Account Selector */}
        <div className="flex-1 max-w-xs">
          <Select value={selectedAccount?.id} onValueChange={handleAccountChange}>
            <SelectTrigger className="h-9">
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

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-3">
          {/* Language Selector */}
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profileImage || user?.picture || authUser?.picture} alt={user?.name} />
              <AvatarFallback className="text-xs">
                {getInitials(user?.name || authUser?.name || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.name}</span>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={t('common.logout')}
              className="h-8 w-8"
            >
              <span className="material-symbols-rounded text-[20px]">logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

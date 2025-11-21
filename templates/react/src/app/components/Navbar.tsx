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
  const { user, selectedAccount, setSelectedAccount } = useMainStore()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleAccountChange = (accountId: string) => {
    const account = user?.accounts?.find((acc) => acc.id === parseInt(accountId))
    if (account) {
      setSelectedAccount(account)
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
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="/etus-logo.ico" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Boilerplate</span>
        </div>

        {/* Account Selector */}
        <div className="flex-1 max-w-sm">
          <Select
            value={selectedAccount?.id?.toString()}
            onValueChange={handleAccountChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('navbar.selectAccount')} />
            </SelectTrigger>
            <SelectContent>
              {user?.accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* Language Selector */}
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={authUser?.picture} alt={authUser?.name} />
              <AvatarFallback>
                {getInitials(authUser?.name || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{authUser?.name}</span>
              <span className="text-xs text-gray-600">{authUser?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={t('common.logout')}
            >
              <span className="material-icons">logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

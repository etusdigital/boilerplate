import { create } from 'zustand'

interface UserAccount {
  account: {
    id: string
    name: string
    domain: string
  }
  role: string
}

interface User {
  id: string
  name: string
  email: string
  profileImage?: string
  picture?: string
  isSuperAdmin: boolean
  userAccounts: UserAccount[]
}

interface MainStore {
  user: User | null
  selectedAccount: { id: string; name: string } | null
  userAccounts: UserAccount[]
  currentLanguage: string
  isLoading: boolean

  setUser: (user: User) => void
  setSelectedAccount: (account: { id: string; name: string }) => void
  changeAccount: (accountId: string) => void
  setLanguage: (lang: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useMainStore = create<MainStore>((set, get) => ({
  user: null,
  selectedAccount: null,
  userAccounts: [],
  currentLanguage: 'pt',
  isLoading: true,

  setUser: (user) => {
    const userAccounts = user.userAccounts || []
    const selectedAccount = userAccounts[0]?.account || null
    set({ user, userAccounts, selectedAccount })
  },

  setSelectedAccount: (account) => set({ selectedAccount: account }),

  changeAccount: (accountId) => {
    const { userAccounts } = get()
    const account = userAccounts.find((ua) => ua.account.id === accountId)?.account
    if (account) {
      set({ selectedAccount: account })
      // Data reload handled by navigation in Navbar component
    }
  },

  setLanguage: (lang) => set({ currentLanguage: lang }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => set({ user: null, selectedAccount: null, userAccounts: [] }),
}))

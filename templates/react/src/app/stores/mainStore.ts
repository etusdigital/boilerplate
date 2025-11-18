import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Account {
  id: number
  name: string
  subdomain: string
}

interface User {
  id: number
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
  accounts: Account[]
}

interface MainState {
  user: User | null
  selectedAccount: Account | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSelectedAccount: (account: Account | null) => void
  setIsLoading: (isLoading: boolean) => void
  clearSession: () => void
}

export const useMainStore = create<MainState>()(
  persist(
    (set) => ({
      user: null,
      selectedAccount: null,
      isLoading: false,

      setUser: (user) => {
        set({ user })
        // Auto-select first account if user has accounts and no account is selected
        if (user?.accounts && user.accounts.length > 0) {
          set((state) => ({
            selectedAccount: state.selectedAccount || user.accounts[0],
          }))
        }
      },

      setSelectedAccount: (account) => set({ selectedAccount: account }),

      setIsLoading: (isLoading) => set({ isLoading }),

      clearSession: () =>
        set({
          user: null,
          selectedAccount: null,
          isLoading: false,
        }),
    }),
    {
      name: 'main-store',
      partialize: (state) => ({
        selectedAccount: state.selectedAccount,
      }),
    }
  )
)

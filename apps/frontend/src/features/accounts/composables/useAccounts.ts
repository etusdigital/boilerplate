import { inject } from 'vue'
import { useMainStore } from '@/app/stores'
import api from '@/shared/api'
import type { Account } from '@/features/accounts/types/account.type'

export function useAccounts() {
  const t = inject('t') as Function
  const toast = inject('toast') as Function
  const mainStore = useMainStore()
  const toastOptions = mainStore.toastOptions

  const getAllAccounts = async (): Promise<Account[]> => {
    try {
      const response = await api.get(`/accounts`)
      return response.data
    } catch (error: any) {
      toast({
        message: t('accountsPage.messages.fetchAccountsError', [error.response.data.message]),
        ...toastOptions,
      })
      return [] as Account[]
    }
  }

  const saveAccount = async (editingAccount: Account, isEditing: boolean): Promise<Account> => {
    const method = isEditing ? api.put : api.post
    const saveUrl = isEditing ? `/accounts/${editingAccount.id}` : `/accounts`
    
    // Extrai apenas os campos permitidos pelo DTO
    const { name, description, domain } = editingAccount
    const accountData = { name, description, domain }
    
    try {
      const response = await method(saveUrl, accountData)

      toast({
        message: t('accounts.messages.success', [editingAccount.name], isEditing ? 2 : 1),
        ...toastOptions,
        ...{ type: 'success' },
      })

      return response.data
    } catch (error: any) {
      toast({
        message: t('accounts.messages.error', [error.response.data.message], isEditing ? 2 : 1),
        ...toastOptions,
      })
      return {} as Account
    }
  }

  const deleteAccount = async (val: Account): Promise<boolean> => {
    try {
      await api.delete(`/accounts/${val.id}`)

      toast({
        message: t('accounts.messages.deleteSuccess', [val.name]),
        ...toastOptions,
        ...{ type: 'success' },
      })

      return true
    } catch (error: any) {
      toast({
        message: t('accounts.messages.deleteError', [val.name, error.response.data.message]),
        ...toastOptions,
      })

      return false
    }
  }

  return {
    getAllAccounts,
    saveAccount,
    deleteAccount,
  }
}

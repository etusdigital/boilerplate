import { ref, computed, onMounted, inject } from 'vue'
import axios from 'axios'
import { useMainStore } from '@/app/stores'
import type { Account } from '@/features/accounts/types/account.type'

export function useAccounts() {
  const mainStore = useMainStore()
  const toast = inject('toast') as any
  const toastOptions = mainStore.toastOptions

  const getAllAccounts = async (): Promise<Account[]> => {
    try {
      const accessToken = await mainStore.getAccessTokenSilently()
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accounts`, {
        headers: {
          'account-id': 1,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error: any) {
      toast({
        message: `Error fetching accounts: ${error.response.data.message}`,
        ...toastOptions,
      })
      return [] as Account[]
    }
  }

  const saveAccount = async (editingAccount: Account, isEditing: boolean): Promise<Account> => {
    const method = isEditing ? axios.put : axios.post
    const saveUrl = isEditing
      ? `${import.meta.env.VITE_BACKEND_URL}/accounts/${editingAccount.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/accounts`
    try {
      const accessToken = await mainStore.getAccessTokenSilently()
      const response = await method(
        saveUrl,
        { ...editingAccount },
        {
          headers: {
            'account-id': 1,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      toast({
        message: `Account: ${editingAccount.name} ${isEditing ? 'updated' : 'created'} successfully`,
        ...toastOptions,
        ...{ type: 'success' },
      })

      return response.data
    } catch (error: any) {
      toast({
        message: `Error ${isEditing ? 'updating' : 'creating'} account: ${error.response.data.message}`,
        ...toastOptions,
      })
      return {} as Account
    }
  }

  const deleteAccount = async (val: Account): Promise<Account> => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/accounts/${val.id}`, {
        headers: {
          'account-id': 1,
        },
      })
      toast({
        message: `Account: ${val.name} deleted successfully`,
        ...toastOptions,
        ...{ type: 'success' },
      })

      return response.data
    } catch (error: any) {
      toast({
        message: `Error deleting account: ${val.name}. ${error.response.data.message}`,
        ...toastOptions,
      })

      return {} as Account
    }
  }

  return {
    getAllAccounts,
    saveAccount,
    deleteAccount,
  }
}

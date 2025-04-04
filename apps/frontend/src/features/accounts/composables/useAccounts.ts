import { ref, computed, onMounted, inject } from 'vue'
import axios from 'axios'
import { useMainStore } from '@/app/stores'
import type { Account } from '@/features/accounts/types/account.type'

export function useAccounts() {
  const mainStore = useMainStore()
  const toast = inject('toast') as any

  const getAllAccounts = async () => {
    const accessToken = await mainStore.getAccessTokenSilently()
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accounts`, {
      headers: {
        'account-id': 1,
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  }

  const saveAccount = async (editingAccount: Account, isEditing: boolean) => {
    const method = isEditing ? axios.put : axios.post
    const saveUrl = isEditing
      ? `${import.meta.env.VITE_BACKEND_URL}/accounts/${editingAccount.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/accounts`
    try {
      const accessToken = await mainStore.getAccessTokenSilently()
      await method(
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
        message: `Conta: ${editingAccount.name} salva com sucesso`,
        type: 'success',
      })
    } catch (error: any) {
      console.log('qubrou ao salvar conta', error)
      toast({
        message: `Erro ao salvar conta: ${error.response.data.message}`,
        type: 'error',
      })
    }
  }

  const deleteAccount = async (val: Account) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/accounts/${val.id}`, {
        headers: {
          'account-id': 1,
        },
      })
      toast({
        message: `Conta: ${val.name} deletada com sucesso`,
        type: 'success',
      })
    } catch (error: any) {
      toast({
        message: `Erro ao deletar a conta: ${val.name}. ${error.response.data.message}`,
        type: 'error',
      })
    }
  }

  return {
    getAllAccounts,
    saveAccount,
    deleteAccount,
  }
}

import { ref, computed, onMounted, inject } from 'vue'
import axios, { AxiosError } from 'axios'
import { useMainStore } from '@/app/stores'
import type { User } from '@/features/users/types/user.type'

export function useUsers() {
  const mainStore = useMainStore()
  const toastOptions = mainStore.toastOptions
  const toast = inject('toast') as any

  const getAllUsers = async () => {
    const accessToken = await mainStore.getAccessTokenSilently()
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      headers: {
        'account-id': 1,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.data
  }

  const saveUser = async (editingUser: User, isEditing: boolean) => {
    const method = isEditing ? axios.put : axios.post
    const saveUrl = isEditing
      ? `${import.meta.env.VITE_BACKEND_URL}/users/${editingUser.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/users`
    try {
      const accessToken = await mainStore.getAccessTokenSilently()
      const response = await method(
        saveUrl,
        { ...editingUser },
        {
          //TODO: Injetar no header dados provenientes da store, para pegar os dados do usuário logado
          headers: {
            'account-id': 1,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      toast({
        message: `Usuário: ${editingUser.email} salvo com sucesso`,
        ...toastOptions,
        ...{ type: 'success' },
      })
    } catch (error: any) {
      toast({
        message: `Erro ao salvar usuário: ${error.response.data.message}`,
        ...toastOptions,
      })
    }
  }

  const deleteUser = async (val: User) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/${val.id}`, {
        headers: {
          'account-id': 1,
          user: JSON.stringify(mainStore.user),
        },
      })

      toast({
        message: `Usuário: ${val.email} deletado com sucesso`,
        ...toastOptions,
        ...{ type: 'success' },
      })
    } catch (error: AxiosError) {
      toast({
        message: `Erro ao deletar o usuário: ${val.email}. ${error.response.data.message}`,
        ...toastOptions,
        ...{ type: 'error' },
      })
    }
  }

  return {
    getAllUsers,
    saveUser,
    deleteUser,
  }
}

import { ref, computed, onMounted, inject } from 'vue'
import axios, { AxiosError } from 'axios'
import { useMainStore } from '@/app/stores'
import type { User } from '@/features/users/types/user.type'

export function useUsers() {
  const mainStore = useMainStore()
  const toastOptions = mainStore.toastOptions
  const toast = inject('toast') as any

  const getAllUsers = async () => {
    try {
      const accessToken = await mainStore.getAccessTokenSilently()

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        headers: {
          'account-id': 1,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error: any) {
      console.log('error', error)
      toast({
        message: `Error fetching users: ${error.response.data.message}`,
        ...toastOptions,
      })
    }
  }

  const saveUser = async (editingUser: User, isEditing: boolean) => {
    editingUser.status = 'accepted'
    const method = isEditing ? axios.put : axios.post
    const saveUrl = isEditing
      ? `${import.meta.env.VITE_BACKEND_URL}/users/${editingUser.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/users`
    try {
      console.log('isLoaded', mainStore.isLoading)
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
      console.log('error', error)
      toast({
        message: `Error saving user: ${error.response.data.message}`,
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
    } catch (error: any) {
      toast({
        message: `Error deleting user: ${val.email}. ${error.response.data.message}`,
        ...toastOptions,
      })
    }
  }

  return {
    getAllUsers,
    saveUser,
    deleteUser,
  }
}

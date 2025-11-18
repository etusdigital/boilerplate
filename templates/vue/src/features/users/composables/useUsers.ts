import { ref, inject } from 'vue'
import api from '@/shared/api'
import { useMainStore } from '@/app/stores'
import type { User, PaginatedUsersResponse, UsersQueryParams, PaginationMeta } from '@/features/users/types/user.type'

export function useUsers() {
  const mainStore = useMainStore()
  const toastOptions = mainStore.toastOptions
  const toast = inject('toast') as Function
  const t = inject('t') as Function

  const users = ref<User[]>([])
  const isLoading = ref(false)
  const paginationMeta = ref<PaginationMeta>({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  async function getAllUsers(params: UsersQueryParams = {}): Promise<PaginatedUsersResponse> {
    isLoading.value = true
    try {
      const response = await api.get('/users', { params })
      users.value = response.data.data
      paginationMeta.value = response.data.meta
      return response.data
    } catch (error: any) {
      toast({
        message: t('users.messages.fetchUsersError', [error.response?.data?.message || 'Unknown error']),
        ...toastOptions,
      })
      users.value = []
      paginationMeta.value = {
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      }
      return {
        data: [],
        meta: paginationMeta.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function saveUser(editingUser: User, isEditing: boolean): Promise<User> {
    if (editingUser.isSuperAdmin === null || editingUser.isSuperAdmin === undefined) editingUser.isSuperAdmin = false

    editingUser.status = 'accepted'
    const method = isEditing ? api.put : api.post
    const saveUrl = isEditing ? `/users/${editingUser.id}` : `/users`
    try {
      const response = await method(saveUrl, { ...editingUser })

      toast({
        message: t('users.messages.userSaveSuccess', [editingUser.email]),
        ...toastOptions,
        ...{ type: 'success' },
      })

      return response.data
    } catch (error: any) {
      toast({
        message: t('users.messages.userSaveError', [error.response.data.message]),
        ...toastOptions,
      })
      return {} as User
    }
  }

  async function deleteUser(val: User): Promise<User> {
    try {
      const response = await api.delete(`/users/${val.id}`)

      toast({
        message: t('users.messages.userDeleteSuccess', [val.email]),
        ...toastOptions,
        ...{ type: 'success' },
      })

      return response.data
    } catch (error: any) {
      toast({
        message: t('users.messages.userDeleteError', [val.email, error.response.data.message]),
        ...toastOptions,
      })
      return {} as User
    }
  }

  async function getUserWithRelations(id: number): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error: any) {
      toast({
        message: t('users.messages.fetchUserError', [error.response?.data?.message || 'Unknown error']),
        ...toastOptions,
      })
      return {} as User
    }
  }

  return {
    users,
    isLoading,
    paginationMeta,
    getAllUsers,
    saveUser,
    deleteUser,
    getUserWithRelations,
  }
}

import { useState } from 'react'
import { usersApi } from '../api/usersApi'
import { User, UsersQueryParams, PaginationMeta } from '../types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
    hasPreviousPage: false,
    hasNextPage: false,
  })

  const fetchUsers = async (params: UsersQueryParams) => {
    setIsLoading(true)
    try {
      const response = await usersApi.list(params)
      setUsers(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (user: Partial<User>) => {
    try {
      await usersApi.create(user)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  }

  const updateUser = async (id: string, user: Partial<User>) => {
    try {
      await usersApi.update(id, user)
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await usersApi.delete(id)
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    }
  }

  return {
    users,
    isLoading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

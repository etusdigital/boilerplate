import api from '@/app/_lib/api-client'
import { User, UsersQueryParams, PaginatedUsersResponse } from '../types'

export const usersApi = {
  list: async (params?: UsersQueryParams) => {
    const response = await api.get<PaginatedUsersResponse>('/users', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  create: async (data: Partial<User>) => {
    const response = await api.post<User>('/users', data)
    return response.data
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

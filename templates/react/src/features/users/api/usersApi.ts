import { api } from '@/app/api'
import { User, UsersQueryParams, PaginatedUsersResponse } from '../types'

export const usersApi = {
  list: (params?: UsersQueryParams) =>
    api.get<PaginatedUsersResponse>('/users', { params }),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (data: Partial<User>) =>
    api.post<User>('/users', data),

  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
}

import api from '@/app/_lib/api-client'
import { Account, AccountsQueryParams, PaginatedAccountsResponse } from '../types'

export const accountsApi = {
  list: async (params?: AccountsQueryParams) => {
    const response = await api.get<PaginatedAccountsResponse>('/accounts', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<Account>(`/accounts/${id}`)
    return response.data
  },

  create: async (data: Partial<Account>) => {
    const response = await api.post<Account>('/accounts', data)
    return response.data
  },

  update: async (id: string, data: Partial<Account>) => {
    const response = await api.put<Account>(`/accounts/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/accounts/${id}`)
    return response.data
  },
}

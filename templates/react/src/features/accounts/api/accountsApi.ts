import { api } from '@/app/api'
import { Account, AccountsQueryParams, PaginatedAccountsResponse } from '../types/account.type'

export const accountsApi = {
  list: (params?: AccountsQueryParams) =>
    api.get<PaginatedAccountsResponse>('/accounts', { params }),

  getById: (id: string) =>
    api.get<Account>(`/accounts/${id}`),

  create: (data: Partial<Account>) =>
    api.post<Account>('/accounts', data),

  update: (id: string, data: Partial<Account>) =>
    api.put<Account>(`/accounts/${id}`, data),

  delete: (id: string) =>
    api.delete(`/accounts/${id}`),
}

import api from '@/app/_lib/api-client'
import type { Account, CreateAccountDto, UpdateAccountDto } from './types'

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const { data } = await api.get('/accounts')
    return data
  },

  getById: async (id: string): Promise<Account> => {
    const { data } = await api.get(`/accounts/${id}`)
    return data
  },

  create: async (accountData: CreateAccountDto): Promise<Account> => {
    const { data } = await api.post('/accounts', accountData)
    return data
  },

  update: async (id: string, accountData: UpdateAccountDto): Promise<Account> => {
    const { data } = await api.patch(`/accounts/${id}`, accountData)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`)
  },
}

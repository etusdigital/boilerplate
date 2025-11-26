import api from '@/app/_lib/api-client'
import type { User, CreateUserDto, UpdateUserDto } from './types'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get('/users')
    return data
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  create: async (userData: CreateUserDto): Promise<User> => {
    const { data } = await api.post('/users', userData)
    return data
  },

  update: async (id: string, userData: UpdateUserDto): Promise<User> => {
    const { data } = await api.patch(`/users/${id}`, userData)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}

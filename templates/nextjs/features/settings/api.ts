import api from '@/app/_lib/api-client'
import type { Setting } from './types'

export const settingsApi = {
  getAll: async (): Promise<Setting[]> => {
    const { data } = await api.get('/settings')
    return data
  },

  update: async (key: string, value: string): Promise<Setting> => {
    const { data } = await api.patch(`/settings/${key}`, { value })
    return data
  },
}

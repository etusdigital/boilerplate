import type { Account } from './account.type'
import type { User } from '../../users/types/user.type'

export type UserAccount = {
  id: number
  accountId: number
  userId: number
  role: string
  account?: Account
  user?: User
}

export interface User {
  id: number
  email: string
  name: string
  roles: string[]
  isAdmin: boolean
  isSuperAdmin: boolean
  status: string
  userAccounts?: UserAccount[]
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface UserAccount {
  id: number
  userId: number
  accountId: number
  account: Account
}

export interface Account {
  id: number
  name: string
}

export interface UserPermission {
  accountId: number
  accountName: string
  role: string
}

export interface PaginationMeta {
  currentPage: number
  limit: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedUsersResponse {
  data: User[]
  meta: PaginationMeta
}

export interface UsersQueryParams {
  page?: number
  limit?: number
  query?: string
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt' | 'deletedAt'
  sortOrder?: 'ASC' | 'DESC'
}

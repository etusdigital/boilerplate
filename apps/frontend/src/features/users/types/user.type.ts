import type { UserAccount } from '@/features/accounts/types/user_account.type'

export interface User {
  id?: number
  name: string
  email: string
  profileImage?: string
  created_at?: string
  deleted_at?: string
  status?: string
  isAdmin?: boolean
  isSuperAdmin?: boolean
  userAccounts?: UserAccount[]
  picture?: string
  roles?: string[]
}

// Enums para filtros (seguindo backend)
export enum UserStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserRole {
  ADMIN = 'admin',
  MASTER_ADMIN = 'master_admin',
  WRITER = 'writer',
  READER = 'reader',
}

// Tipos para paginação (seguindo padrão backend)
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

// Parâmetros de query para API paginada
export interface UsersQueryParams {
  page?: number
  limit?: number
  offset?: number
  search?: string
  role?: UserRole
  status?: UserStatus
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'email'
  sortOrder?: 'ASC' | 'DESC'
}

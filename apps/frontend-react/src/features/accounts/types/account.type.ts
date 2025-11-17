export interface Account {
  id: number
  name: string
  slug?: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginationMeta {
  currentPage: number
  limit: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedAccountsResponse {
  data: Account[]
  meta: PaginationMeta
}

export interface AccountsQueryParams {
  page?: number
  limit?: number
  search?: string
}

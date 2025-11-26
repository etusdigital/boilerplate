export interface Account {
  id: string
  name: string
  domain: string
  createdAt: string
  updatedAt: string
}

export interface CreateAccountDto {
  name: string
  domain: string
}

export interface UpdateAccountDto {
  name?: string
  domain?: string
}

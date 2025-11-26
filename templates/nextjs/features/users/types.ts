export interface User {
  id: string
  name: string
  email: string
  isSuperAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  name: string
  email: string
  isSuperAdmin?: boolean
}

export interface UpdateUserDto {
  name?: string
  email?: string
  isSuperAdmin?: boolean
}

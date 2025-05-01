export interface User {
  id?: number
  name: string
  email: string
  profileImage?: string
  created_at?: string
  deleted_at?: string
  status?: string
  roles?: string[]
  isAdmin?: boolean
  [key: string]: any
}

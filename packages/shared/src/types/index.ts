// Types partagés entre frontend et backend

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'sage_femme' | 'secretaire'
  rpps?: string | null
  adeli?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Patient = {
  id: string
  userId: string
  firstName: string
  lastName: string
  birthDate: string
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  postalCode?: string | null
  status: 'active' | 'inactive' | 'archived'
  createdAt: Date
  updatedAt: Date
}

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
  rpps?: string
  adeli?: string
}

export type AuthResponse = ApiResponse<{
  user: User
  token?: string
}>

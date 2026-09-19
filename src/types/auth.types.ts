import type {
    AuthResponse,
    LoginRequest,
    RefreshTokenRequest,
    RefreshResponse,
    RegisterRequest,
    Rol,
    User,
} from '@/contracts/auth'

export type {
    AuthResponse,
    LoginRequest,
    RefreshTokenRequest,
    RefreshResponse,
    RegisterRequest,
    Rol,
    User,
}

export type AuthTokens = {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

export type AuthState = {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    expiresIn: number | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

export type LoginCredentials = LoginRequest
export type RegisterData = RegisterRequest

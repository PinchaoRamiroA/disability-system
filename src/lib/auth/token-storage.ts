import type { User } from '@/contracts/auth'

const ACCESS_TOKEN_KEY = 'medflow_access_token'
const REFRESH_TOKEN_KEY = 'medflow_refresh_token'
const USER_KEY = 'medflow_user'

export const tokenStorage = {
    getAccessToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    },

    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    getUser(): User | null {
        if (typeof window === 'undefined') return null
        const raw = localStorage.getItem(USER_KEY)
        if (!raw) return null
        try {
            return JSON.parse(raw) as User
        } catch {
            return null
        }
    },

    setAuthSession(data: {
        accessToken: string
        refreshToken: string
        user: User
    }): void {
        if (typeof window === 'undefined') return
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    },

    setTokens(tokens: { accessToken: string; refreshToken: string }): void {
        if (typeof window === 'undefined') return
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    },

    clearAuthSession(): void {
        if (typeof window === 'undefined') return
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },
}

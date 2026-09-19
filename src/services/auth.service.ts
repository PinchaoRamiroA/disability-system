import { apiClient } from '@/lib/api/axios'
import { tokenStorage } from '@/lib/auth/token-storage'
import type {
    AuthResponse,
    LoginRequest,
    RefreshResponse,
    RegisterRequest,
    User,
} from '@/contracts/auth'

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse['data']> {
        const response = await apiClient.post<AuthResponse>(
            '/auth/login',
            credentials
        )
        const data = response.data.data
        if (data?.access_token && data?.user) {
            tokenStorage.setAuthSession({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                user: data.user,
            })
        }
        return data
    },

    async register(data: RegisterRequest): Promise<User> {
        const response = await apiClient.post<{
            success: boolean
            message: string
            data: User
        }>('/auth/register', data)
        return response.data.data
    },

    async refreshToken(refreshToken: string): Promise<RefreshResponse['data']> {
        const response = await apiClient.post<RefreshResponse>(
            '/auth/refresh',
            { refresh_token: refreshToken }
        )
        const data = response.data.data
        if (data?.access_token) {
            tokenStorage.setTokens({
                accessToken: data.access_token,
                refreshToken: data.refresh_token || refreshToken,
            })
        }
        return data
    },

    logout(): void {
        tokenStorage.clearAuthSession()
        delete apiClient.defaults.headers.common.Authorization
    },
}

export default authService

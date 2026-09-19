import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/lib/auth/token-storage'
import type { RefreshResponse } from '@/contracts/auth'

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'https://disability-system-backend.onrender.com/api/v1'

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else if (token) {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Callback listener for logout events triggered by 401 failures
type AuthEventListener = () => void
const logoutListeners: AuthEventListener[] = []

export const onAuthLogout = (listener: AuthEventListener) => {
    logoutListeners.push(listener)
    return () => {
        const index = logoutListeners.indexOf(listener)
        if (index > -1) {
            logoutListeners.splice(index, 1)
        }
    }
}

const triggerLogout = () => {
    tokenStorage.clearAuthSession()
    logoutListeners.forEach((listener) => listener())
}

// Request Interceptor: Inject Bearer Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken()
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response Interceptor: Automatic 401 Refresh & Queue Handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        if (!originalRequest) {
            return Promise.reject(error)
        }

        const isAuthEndpoint =
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/register')

        // If error is 401 and request was not already retried and not an auth endpoint
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            const refreshToken = tokenStorage.getRefreshToken()

            if (!refreshToken) {
                triggerLogout()
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((newToken) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`
                        }
                        return apiClient(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Call refresh endpoint directly using raw axios to avoid interceptor loop
                const response = await axios.post<RefreshResponse>(
                    `${BASE_URL}/auth/refresh`,
                    { refresh_token: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                )

                const refreshData = response.data?.data
                if (!refreshData?.access_token) {
                    throw new Error('Formato de respuesta de refresh token inválido')
                }

                const newAccessToken = refreshData.access_token
                const newRefreshToken = refreshData.refresh_token || refreshToken

                tokenStorage.setTokens({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                })

                apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
                processQueue(null, newAccessToken)

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                }

                return apiClient(originalRequest)
            } catch (refreshErr) {
                processQueue(refreshErr, null)
                triggerLogout()
                return Promise.reject(refreshErr)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient

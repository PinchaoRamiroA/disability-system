import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/services/auth.service'
import { tokenStorage } from '@/lib/auth/token-storage'
import type { AuthState, LoginCredentials, RegisterData } from '@/types/auth.types'
import type { User } from '@/contracts/auth'
import axios from 'axios'

const getInitialState = (): AuthState => {
    return {
        user: null,
        accessToken: null,
        refreshToken: null,
        tokenType: 'Bearer',
        expiresIn: null,
        isAuthenticated: false,
        isInitialized: false,
        isLoading: false,
        error: null,
    }
}

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            return await authService.login(credentials)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                    return rejectWithValue(
                        'El servidor tardó demasiado en responder (arranque en frío). Por favor, intenta de nuevo en unos segundos.'
                    )
                }
                if (!error.response) {
                    return rejectWithValue(
                        'No se pudo conectar con el servidor backend. Verifica tu conexión o el estado de la API.'
                    )
                }
                if (error.response.data?.message) {
                    return rejectWithValue(error.response.data.message as string)
                }
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('Error al iniciar sesión')
        }
    }
)

export const registerThunk = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            return await authService.register(data)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                    return rejectWithValue(
                        'El servidor tardó demasiado en responder. Por favor, intenta de nuevo.'
                    )
                }
                if (!error.response) {
                    return rejectWithValue(
                        'No se pudo conectar con el servidor backend. Verifica tu conexión.'
                    )
                }
                if (error.response.data?.message) {
                    return rejectWithValue(error.response.data.message as string)
                }
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('Error al registrar usuario')
        }
    }
)

export const refreshTokenThunk = createAsyncThunk(
    'auth/refresh',
    async (token: string, { rejectWithValue }) => {
        try {
            return await authService.refreshToken(token)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.message) {
                    return rejectWithValue(error.response.data.message as string)
                }
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('Error al renovar sesión')
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                user: User
                accessToken: string
                refreshToken: string
                tokenType?: string
                expiresIn?: number
            }>
        ) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.tokenType = action.payload.tokenType || 'Bearer'
            state.expiresIn = action.payload.expiresIn || null
            state.isAuthenticated = true
            state.isInitialized = true
            state.error = null
            tokenStorage.setAuthSession({
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                user: action.payload.user,
            })
        },

        setTokens: (
            state,
            action: PayloadAction<{
                accessToken: string
                refreshToken: string
            }>
        ) => {
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            tokenStorage.setTokens(action.payload)
        },

        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.tokenType = null
            state.expiresIn = null
            state.isAuthenticated = false
            state.isInitialized = true
            state.error = null
            authService.logout()
        },

        clearError: (state) => {
            state.error = null
        },

        hydrateAuth: (state) => {
            const accessToken = tokenStorage.getAccessToken()
            const refreshToken = tokenStorage.getRefreshToken()
            const user = tokenStorage.getUser()

            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.user = user
            state.isAuthenticated = Boolean(accessToken && user)
            state.isInitialized = true
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.accessToken = action.payload.access_token
                state.refreshToken = action.payload.refresh_token
                state.tokenType = action.payload.token_type
                state.expiresIn = action.payload.expires_in
                state.isAuthenticated = true
                state.isInitialized = true
                state.error = null
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false
                state.isInitialized = true
                state.error = (action.payload as string) || 'Error desconocido'
            })

        // Register
        builder
            .addCase(registerThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerThunk.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = (action.payload as string) || 'Error al registrar'
            })

        // Refresh
        builder
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.accessToken = action.payload.access_token
                state.refreshToken = action.payload.refresh_token || state.refreshToken
                state.expiresIn = action.payload.expires_in
            })
            .addCase(refreshTokenThunk.rejected, (state) => {
                state.user = null
                state.accessToken = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.isInitialized = true
            })
    },
})

export const { setCredentials, setTokens, logout, clearError, hydrateAuth } =
    authSlice.actions

export default authSlice.reducer

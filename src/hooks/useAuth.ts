'use client'

import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    clearError,
    loginThunk,
    logout,
    registerThunk,
} from '@/store/slices/auth.slice'
import type { LoginCredentials, RegisterData } from '@/types/auth.types'

export function useAuth() {
    const dispatch = useAppDispatch()
    const {
        user,
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        isAuthenticated,
        isInitialized,
        isLoading,
        error,
    } = useAppSelector((state) => state.auth)

    const permissions = useMemo(() => {
        return user?.rol?.permisos || []
    }, [user])

    const hasPermission = useCallback(
        (permission: string) => {
            return permissions.includes(permission)
        },
        [permissions]
    )

    const isAdmin = useMemo(() => {
        const roleName = user?.rol?.nombre?.toLowerCase() || ''
        return roleName.includes('admin') || roleName.includes('super')
    }, [user])

    const handleLogin = useCallback(
        async (credentials: LoginCredentials) => {
            return dispatch(loginThunk(credentials)).unwrap()
        },
        [dispatch]
    )

    const handleRegister = useCallback(
        async (data: RegisterData) => {
            return dispatch(registerThunk(data)).unwrap()
        },
        [dispatch]
    )

    const handleLogout = useCallback(() => {
        dispatch(logout())
    }, [dispatch]
    )

    const handleClearError = useCallback(() => {
        dispatch(clearError())
    }, [dispatch])

    return {
        user,
        role: user?.rol || null,
        permissions,
        hasPermission,
        isAdmin,
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        isAuthenticated,
        isInitialized,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError: handleClearError,
    }
}

export default useAuth

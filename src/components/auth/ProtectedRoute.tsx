'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Activity, ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: string
    requiredPermission?: string
    adminOnly?: boolean
}

export function ProtectedRoute({
    children,
    requiredRole,
    requiredPermission,
    adminOnly = false,
}: ProtectedRouteProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated, isInitialized, isLoading, user, isAdmin, hasPermission } = useAuth()

    useEffect(() => {
        if (!isInitialized) return

        if (!isAuthenticated) {
            const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login'
            router.replace(redirectUrl)
        }
    }, [isInitialized, isAuthenticated, pathname, router])

    // While checking session / hydrating from tokenStorage
    if (!isInitialized || (isLoading && !user)) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 select-none">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-lg">
                            <Activity className="h-7 w-7 text-blue-500 animate-pulse" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </div>
                    <div className="text-center space-y-1">
                        <h2 className="text-sm font-medium text-white tracking-wide">
                            MedFlow Enterprise
                        </h2>
                        <p className="text-xs text-[#94a3b8]">
                            Verificando autorización y credenciales de acceso...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // If not authenticated, the useEffect initiates redirect; render placeholder loader
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="text-xs text-[#64748b]">Redirigiendo a inicio de sesión...</div>
            </div>
        )
    }

    // Role or Permission check
    const roleMismatch = requiredRole && user?.rol?.nombre?.toLowerCase() !== requiredRole.toLowerCase()
    const adminMismatch = adminOnly && !isAdmin
    const permissionMismatch = requiredPermission && !hasPermission(requiredPermission)

    if (roleMismatch || adminMismatch || permissionMismatch) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#111827] border border-[#334155] rounded-xl p-6 shadow-xl space-y-6 text-center">
                    <div className="mx-auto h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <ShieldAlert className="h-7 w-7" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-lg font-semibold text-white">
                            Acceso Restringido (403)
                        </h1>
                        <p className="text-xs text-[#94a3b8] leading-relaxed">
                            Su rol actual (<span className="text-blue-400 font-medium">{user?.rol?.nombre || 'Usuario'}</span>) no cuenta con los permisos necesarios para visualizar este módulo.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-medium border border-[#334155] transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Regresar</span>
                        </button>
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Ir al Dashboard</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export default ProtectedRoute

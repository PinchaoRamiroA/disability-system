'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    Menu,
    Search,
    ChevronRight,
    LogOut,
    Shield,
    Settings,
    CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { NotificationDropdown } from '@/components/layout/NotificationDropdown'

interface TopbarProps {
    onOpenMobileSidebar: () => void
}

const ROUTE_LABELS: Record<string, string> = {
    dashboard: 'Dashboard',
    incapacidades: 'Incapacidades',
    crear: 'Radicar Nueva',
    documentos: 'Expediente Documental',
    transcripciones: 'Transcripción EPS / ARL',
    cobros: 'Gestión de Cobro',
    seguimientos: 'Bitácora de Seguimientos',
    juridico: 'Cobro Jurídico',
    pagos: 'Registro de Pagos',
    conciliacion: 'Conciliación Contable',
    alertas: 'Centro de Alertas',
    reportes: 'Reportes y Estadísticas',
    usuarios: 'Gestión de Usuarios',
    roles: 'Roles y Permisos',
    configuracion: 'Configuración',
    auditoria: 'Auditoría y Trazabilidad',
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const menuRef = useRef<HTMLDivElement>(null)

    // Close user dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Generate breadcrumbs from pathname
    const pathSegments = (pathname || '').split('/').filter(Boolean)
    const breadcrumbs = pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`
        const label = ROUTE_LABELS[segment] || segment.replace(/-/g, ' ')
        const isLast = index === pathSegments.length - 1
        return { url, label, isLast }
    })

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/incapacidades?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <header className="h-[72px] bg-[#111827] border-b border-[#334155] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
            {/* Left Section: Mobile Hamburger & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onOpenMobileSidebar}
                    className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] lg:hidden shrink-0 border border-[#334155]"
                    aria-label="Abrir menú de navegación"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Breadcrumbs Navigation */}
                <nav
                    className="hidden sm:flex items-center gap-1.5 text-xs text-[#94a3b8] overflow-hidden truncate"
                    aria-label="Ruta de navegación"
                >
                    <Link
                        href="/dashboard"
                        className="hover:text-white transition text-[#64748b] hover:underline"
                    >
                        Inicio
                    </Link>
                    {breadcrumbs.map((crumb) => (
                        <React.Fragment key={crumb.url}>
                            <ChevronRight className="h-3.5 w-3.5 text-[#475569] shrink-0" />
                            {crumb.isLast ? (
                                <span className="text-white font-medium capitalize truncate">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.url}
                                    className="hover:text-white transition capitalize truncate"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Right Section: Global Search, Quick Stats, Alerts & User Menu */}
            <div className="flex items-center gap-3">
                {/* Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative hidden md:block w-64 lg:w-80"
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por radicado, cédula o EPS..."
                        className="w-full pl-9 pr-12 py-1.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-[#64748b] bg-[#1e293b] border border-[#334155] rounded">
                            ⌘K
                        </kbd>
                    </div>
                </form>

                {/* Health/System status pill */}
                <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0f172a] border border-[#334155] text-[11px] text-[#cbd5e1]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-medium text-[#94a3b8]">Disability System v1.0</span>
                </div>

                {/* Notifications Dropdown (Task 4.2.3) */}
                <NotificationDropdown />

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setUserMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2.5 p-1 pl-2 rounded-lg hover:bg-[#1e293b] border border-transparent hover:border-[#334155] transition text-left"
                    >
                        <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                            {user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-xs font-semibold text-white leading-none">
                                {user?.nombre || 'Usuario'}
                            </div>
                            <span className="text-[10px] text-blue-400 font-medium leading-tight">
                                {user?.rol?.nombre || 'Operador'}
                            </span>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-[#334155] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-3 py-2 border-b border-[#334155] mb-1">
                                <p className="text-xs font-semibold text-white truncate">
                                    {user?.nombre}
                                </p>
                                <p className="text-[11px] text-[#94a3b8] truncate">
                                    {user?.correo}
                                </p>
                                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    <Shield className="h-2.5 w-2.5" />
                                    <span>Rol: {user?.rol?.nombre || 'Operador'}</span>
                                </div>
                            </div>

                            <Link
                                href="/incapacidades"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white transition"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                                <span>Mis Radicaciones</span>
                            </Link>

                            <Link
                                href="/configuracion"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white transition"
                            >
                                <Settings className="h-3.5 w-3.5 text-[#94a3b8]" />
                                <span>Ajustes del Sistema</span>
                            </Link>

                            <div className="border-t border-[#334155] my-1"></div>

                            <button
                                onClick={() => {
                                    setUserMenuOpen(false)
                                    logout()
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition text-left"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Topbar

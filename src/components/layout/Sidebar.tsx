'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Activity,
    LayoutDashboard,
    FileText,
    PlusCircle,
    FileCheck,
    Send,
    DollarSign,
    Scale,
    Bell,
    BarChart3,
    History,
    Users,
    ShieldCheck,
    Settings,
    ChevronDown,
    ChevronRight,
    LogOut,
    X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
    isOpenMobile: boolean
    onCloseMobile: () => void
}

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
    badge?: string
    badgeColor?: string
    subItems?: { label: string; href: string }[]
}

interface NavGroup {
    title: string
    items: NavItem[]
}

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        Incapacidades: true,
        Cobros: false,
    })

    const toggleSubmenu = (name: string) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    const navigationGroups: NavGroup[] = [
        {
            title: 'OPERACIONES',
            items: [
                {
                    label: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutDashboard,
                },
                {
                    label: 'Incapacidades',
                    href: '/incapacidades',
                    icon: FileText,
                    subItems: [
                        { label: 'Listado General', href: '/incapacidades' },
                        { label: 'Radicar Nueva', href: '/incapacidades/crear' },
                    ],
                },
                {
                    label: 'Expediente Documental',
                    href: '/documentos',
                    icon: FileCheck,
                },
                {
                    label: 'Transcripción EPS / ARL',
                    href: '/transcripciones',
                    icon: Send,
                    badge: 'Terminos',
                    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                },
            ],
        },
        {
            title: 'FINANCIERO & COBRO',
            items: [
                {
                    label: 'Gestión de Cobro',
                    href: '/cobros',
                    icon: DollarSign,
                    subItems: [
                        { label: 'Resumen de Cobros', href: '/cobros' },
                        { label: 'Bitácora Seguimientos', href: '/cobros/seguimientos' },
                        { label: 'Cobro Jurídico', href: '/cobros/juridico' },
                        { label: 'Registro de Pagos', href: '/cobros/pagos' },
                    ],
                },
                {
                    label: 'Conciliación Contable',
                    href: '/conciliacion',
                    icon: Scale,
                },
            ],
        },
        {
            title: 'CONTROL & REPORTES',
            items: [
                {
                    label: 'Centro de Alertas',
                    href: '/alertas',
                    icon: Bell,
                    badge: '5',
                    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
                },
                {
                    label: 'Reportes & SG-SST',
                    href: '/reportes',
                    icon: BarChart3,
                },
                {
                    label: 'Auditoría y Trazabilidad',
                    href: '/auditoria',
                    icon: History,
                },
            ],
        },
        {
            title: 'ADMINISTRACIÓN',
            items: [
                {
                    label: 'Gestión de Usuarios',
                    href: '/usuarios',
                    icon: Users,
                },
                {
                    label: 'Roles y Permisos',
                    href: '/roles',
                    icon: ShieldCheck,
                },
                {
                    label: 'Configuración y Catálogos',
                    href: '/configuracion',
                    icon: Settings,
                },
            ],
        },
    ]

    const isRouteActive = (href: string, exact = false) => {
        if (!pathname) return false
        if (exact) return pathname === href
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname === href || pathname.startsWith(`${href}/`)
    }

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpenMobile && (
                <div
                    onClick={onCloseMobile}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[#020617] border-r border-[#334155] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpenMobile ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="h-[72px] px-6 border-b border-[#334155] flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        onClick={onCloseMobile}
                        className="flex items-center gap-3 group"
                    >
                        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-base tracking-tight text-white">
                                    Disability System
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    SaaS
                                </span>
                            </div>
                            <span className="text-[11px] text-[#94a3b8] -mt-0.5">
                                Incapacidades & Cobros
                            </span>
                        </div>
                    </Link>

                    {/* Mobile close button */}
                    <button
                        onClick={onCloseMobile}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Quick Action Button */}
                <div className="px-4 pt-4 pb-2">
                    <Link
                        href="/incapacidades/crear"
                        onClick={onCloseMobile}
                        className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Nueva Incapacidad</span>
                    </Link>
                </div>

                {/* Scrollable Navigation Groups */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
                    {navigationGroups.map((group) => (
                        <div key={group.title} className="space-y-1">
                            <div className="px-3 py-1 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                                {group.title}
                            </div>

                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const Icon = item.icon
                                    const active = isRouteActive(item.href)
                                    const hasSubmenu = Boolean(item.subItems && item.subItems.length > 0)
                                    const isExpanded = Boolean(expandedMenus[item.label])

                                    if (hasSubmenu) {
                                        return (
                                            <div key={item.label} className="space-y-0.5">
                                                <button
                                                    onClick={() => toggleSubmenu(item.label)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group select-none ${
                                                        active
                                                            ? 'bg-[#1e293b] text-white'
                                                            : 'text-[#cbd5e1] hover:bg-[#111827] hover:text-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Icon
                                                            className={`h-4 w-4 transition ${
                                                                active
                                                                    ? 'text-blue-400'
                                                                    : 'text-[#94a3b8] group-hover:text-white'
                                                            }`}
                                                        />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {item.badge && (
                                                            <span
                                                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                                                                    item.badgeColor ||
                                                                    'bg-[#1e293b] text-[#cbd5e1] border-[#334155]'
                                                                }`}
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                        {isExpanded ? (
                                                            <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8]" />
                                                        ) : (
                                                            <ChevronRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Submenu links */}
                                                {isExpanded && item.subItems && (
                                                    <div className="pl-9 pr-2 py-0.5 space-y-0.5 border-l border-[#334155]/60 ml-4">
                                                        {item.subItems.map((sub) => {
                                                            const subActive = isRouteActive(sub.href, true)
                                                            return (
                                                                <Link
                                                                    key={sub.href}
                                                                    href={sub.href}
                                                                    onClick={onCloseMobile}
                                                                    className={`block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                                                                        subActive
                                                                            ? 'bg-[#1e40af]/30 text-blue-300 font-semibold border-l-2 border-blue-500'
                                                                            : 'text-[#94a3b8] hover:text-white hover:bg-[#111827]'
                                                                    }`}
                                                                >
                                                                    {sub.label}
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onCloseMobile}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                                                active
                                                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                                                    : 'text-[#cbd5e1] hover:bg-[#111827] hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon
                                                    className={`h-4 w-4 transition ${
                                                        active
                                                            ? 'text-blue-400'
                                                            : 'text-[#94a3b8] group-hover:text-white'
                                                    }`}
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span
                                                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                                                        item.badgeColor ||
                                                        'bg-[#1e293b] text-[#cbd5e1] border-[#334155]'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Session Footer */}
                <div className="p-3 border-t border-[#334155] bg-[#090d1a]">
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#111827] border border-[#334155]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                                {user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'US'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-white truncate">
                                    {user?.nombre || 'Usuario'}
                                </p>
                                <span className="text-[10px] text-blue-400 font-medium truncate block">
                                    {user?.rol?.nombre || 'Operador'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            title="Cerrar sesión"
                            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar

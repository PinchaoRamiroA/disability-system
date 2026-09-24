'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    AlertTriangle,
    ChevronRight,
    ExternalLink,
    ShieldAlert,
    FileText,
} from 'lucide-react'
import { Notificacion } from '@/contracts/notificaciones'
import {
    getNotificaciones,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '@/services/notificacion.service'

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = useCallback(async () => {
        try {
            const [listRes, count] = await Promise.all([
                getNotificaciones({ limit: 8 }),
                getUnreadNotificationsCount(),
            ])
            setNotificaciones(listRes.items || [])
            setUnreadCount(count)
        } catch {
            // Silencioso
        }
    }, [])

    useEffect(() => {
        let isMounted = true
        getNotificaciones({ limit: 8 })
            .then((res) => {
                if (isMounted) setNotificaciones(res.items || [])
            })
            .catch(() => {})

        getUnreadNotificationsCount()
            .then((count) => {
                if (isMounted) setUnreadCount(count)
            })
            .catch(() => {})

        return () => {
            isMounted = false
        }
    }, [])

    // Cerrar al hacer clic afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleToggle = () => {
        const next = !isOpen
        setIsOpen(next)
        if (next) {
            fetchNotifications()
        }
    }

    const handleMarkAsRead = async (e: React.MouseEvent, notif: Notificacion) => {
        e.stopPropagation()
        if (notif.leida) return

        try {
            await markNotificationAsRead(notif.id_notificacion)
            setNotificaciones((prev) =>
                prev.map((n) =>
                    n.id_notificacion === notif.id_notificacion
                        ? { ...n, leida: true }
                        : n
                )
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch {
            // Silencioso
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            setLoading(true)
            await markAllNotificationsAsRead()
            setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
            setUnreadCount(0)
        } catch {
            // Silencioso
        } finally {
            setLoading(false)
        }
    }

    const getIconForType = (tipo: string) => {
        const lower = tipo.toLowerCase()
        if (lower.includes('venc') || lower.includes('alerta') || lower.includes('mora')) {
            return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
        }
        if (lower.includes('urgente') || lower.includes('crítico') || lower.includes('critico')) {
            return <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
        }
        if (lower.includes('transcri') || lower.includes('radic')) {
            return <Clock className="h-4 w-4 text-purple-400 shrink-0" />
        }
        return <FileText className="h-4 w-4 text-blue-400 shrink-0" />
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón Campana */}
            <button
                type="button"
                onClick={handleToggle}
                title="Centro de Notificaciones y Vencimientos"
                className={`relative p-2 rounded-lg border transition ${
                    isOpen
                        ? 'bg-[#1e293b] border-blue-500/50 text-white'
                        : 'bg-[#0f172a] hover:bg-[#1e293b] border-[#334155] text-[#94a3b8] hover:text-white'
                }`}
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Popover Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111827] border border-[#334155] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="p-3.5 bg-[#0f172a]/80 border-b border-[#1f2937] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white tracking-tight">
                                Notificaciones
                            </span>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    {unreadCount} sin leer
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                                className="text-[11px] font-medium text-[#94a3b8] hover:text-white flex items-center gap-1 transition disabled:opacity-50"
                            >
                                <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                                <span>Marcar todas</span>
                            </button>
                        )}
                    </div>

                    {/* Lista de Notificaciones */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#1f2937]">
                        {notificaciones.length === 0 ? (
                            <div className="py-8 px-4 text-center space-y-2">
                                <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto">
                                    <Bell className="h-4 w-4" />
                                </div>
                                <p className="text-xs font-semibold text-white">
                                    Sin notificaciones recientes
                                </p>
                                <p className="text-[11px] text-[#64748b]">
                                    Las alertas de plazos por vencer y novedades de transcripción aparecerán aquí.
                                </p>
                            </div>
                        ) : (
                            notificaciones.map((notif) => {
                                const targetUrl = notif.id_incapacidad
                                    ? `/incapacidades/${notif.id_incapacidad}`
                                    : '/transcripciones'

                                return (
                                    <div
                                        key={notif.id_notificacion}
                                        onClick={() => {
                                            if (!notif.leida) {
                                                markNotificationAsRead(notif.id_notificacion)
                                            }
                                            setIsOpen(false)
                                        }}
                                        className={`p-3.5 flex items-start gap-3 hover:bg-[#1e293b]/70 transition cursor-pointer relative group ${
                                            !notif.leida ? 'bg-blue-600/5' : ''
                                        }`}
                                    >
                                        <div className="mt-0.5">
                                            {getIconForType(notif.tipo_notificacion)}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-1.5">
                                                <h4
                                                    className={`text-xs truncate ${
                                                        !notif.leida
                                                            ? 'font-bold text-white'
                                                            : 'font-medium text-[#cbd5e1]'
                                                    }`}
                                                >
                                                    {notif.titulo}
                                                </h4>
                                                {!notif.leida && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">
                                                {notif.mensaje}
                                            </p>

                                            <div className="pt-1 flex items-center justify-between text-[10px] text-[#64748b]">
                                                <span className="font-mono">
                                                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString('es-CO', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }) : 'Reciente'}
                                                </span>

                                                <Link
                                                    href={targetUrl}
                                                    className="inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 font-medium opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <span>Ver</span>
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </Link>
                                            </div>
                                        </div>

                                        {!notif.leida && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleMarkAsRead(e, notif)}
                                                className="p-1 rounded text-[#64748b] hover:text-white hover:bg-[#334155] transition"
                                                title="Marcar como leída"
                                            >
                                                <Check className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 bg-[#0f172a]/80 border-t border-[#1f2937] text-center">
                        <Link
                            href="/alertas"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition py-1 w-full"
                        >
                            <span>Ir al Centro de Alertas y Vencimientos</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown

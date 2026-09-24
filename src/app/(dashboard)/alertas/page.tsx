'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
    Bell,
    ShieldAlert,
    Clock,
    CheckCircle2,
    CheckCheck,
    Check,
    RefreshCw,
    ExternalLink,
    FileText,
    Flame,
} from 'lucide-react'
import { Notificacion } from '@/contracts/notificaciones'
import {
    getNotificaciones,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '@/services/notificacion.service'

type TabFiltro = 'todas' | 'no_leidas' | 'vencimientos' | 'documentos'

export default function AlertasPage() {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<TabFiltro>('todas')
    const [actionLoading, setActionLoading] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const showToast = (text: string) => {
        setToastMessage(text)
        setTimeout(() => setToastMessage(null), 3500)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [listRes, count] = await Promise.all([
                getNotificaciones({ limit: 50 }),
                getUnreadNotificationsCount(),
            ])
            setNotificaciones(listRes.items || [])
            setUnreadCount(count)
        } catch (err) {
            console.error('Error fetching alertas/notificaciones:', err)
            showToast('Error al consultar notificaciones y alertas.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let isMounted = true
        Promise.all([
            getNotificaciones({ limit: 50 }),
            getUnreadNotificationsCount(),
        ])
            .then(([listRes, count]) => {
                if (isMounted) {
                    setNotificaciones(listRes.items || [])
                    setUnreadCount(count)
                }
            })
            .catch(() => {})
            .finally(() => {
                if (isMounted) setLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id)
            setNotificaciones((prev) =>
                prev.map((n) => (n.id_notificacion === id ? { ...n, leida: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
            showToast('Notificación marcada como leída.')
        } catch {
            showToast('Error al marcar notificación.')
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            setActionLoading(true)
            await markAllNotificationsAsRead()
            setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
            setUnreadCount(0)
            showToast('Todas las notificaciones marcadas como leídas.')
        } catch {
            showToast('Error al procesar la solicitud.')
        } finally {
            setActionLoading(false)
        }
    }

    // Filtrado de notificaciones
    const filteredNotificaciones = useMemo(() => {
        return notificaciones.filter((n) => {
            if (activeTab === 'no_leidas') return !n.leida
            if (activeTab === 'vencimientos') {
                const lower = (n.tipo_notificacion || n.titulo || '').toLowerCase()
                return (
                    lower.includes('venc') ||
                    lower.includes('alerta') ||
                    lower.includes('transc') ||
                    lower.includes('plazo')
                )
            }
            if (activeTab === 'documentos') {
                const lower = (n.tipo_notificacion || n.titulo || '').toLowerCase()
                return lower.includes('doc') || lower.includes('incompleto')
            }
            return true
        })
    }, [notificaciones, activeTab])

    const metrics = useMemo(() => {
        const total = notificaciones.length
        const noLeidas = unreadCount
        let vencimientos = 0

        notificaciones.forEach((n) => {
            const lower = (n.tipo_notificacion || n.titulo || '').toLowerCase()
            if (
                lower.includes('venc') ||
                lower.includes('alerta') ||
                lower.includes('transc') ||
                lower.includes('plazo')
            ) {
                vencimientos++
            }
        })

        return { total, noLeidas, vencimientos }
    }, [notificaciones, unreadCount])

    const getIconForType = (tipo: string) => {
        const lower = (tipo || '').toLowerCase()
        if (lower.includes('urgente') || lower.includes('crítico')) {
            return (
                <div className="h-9 w-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                </div>
            )
        }
        if (lower.includes('venc') || lower.includes('plazo') || lower.includes('transc')) {
            return (
                <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="h-5 w-5" />
                </div>
            )
        }
        return (
            <div className="h-9 w-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <FileText className="h-5 w-5" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#064e3b] border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <Bell className="h-6 w-6 text-red-400" />
                        <span>Centro de Alertas y Vencimientos</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                        Notificaciones de plazos perentorios, vencimientos de radicación ante EPS/ARL y alertas tempranas.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition disabled:opacity-50"
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            <span>Marcar todas leídas</span>
                        </button>
                    )}
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#cbd5e1] bg-[#1f2937] hover:bg-[#374151] border border-[#334155] transition disabled:opacity-50"
                        title="Actualizar registros"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {/* Métricas Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center justify-between">
                    <div>
                        <span className="text-xs text-[#94a3b8] font-medium block">
                            Total Notificaciones
                        </span>
                        <div className="text-2xl font-bold text-white mt-1">
                            {loading ? '...' : metrics.total}
                        </div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Bell className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center justify-between">
                    <div>
                        <span className="text-xs text-[#94a3b8] font-medium block">
                            Sin Leer (Pendientes)
                        </span>
                        <div className="text-2xl font-bold text-amber-400 mt-1">
                            {loading ? '...' : metrics.noLeidas}
                        </div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center justify-between">
                    <div>
                        <span className="text-xs text-[#94a3b8] font-medium block">
                            Vencimientos Próximos
                        </span>
                        <div className="text-2xl font-bold text-rose-400 mt-1">
                            {loading ? '...' : metrics.vencimientos}
                        </div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Pestañas de Filtro */}
            <div className="flex items-center gap-2 border-b border-[#334155] pb-px overflow-x-auto">
                {[
                    { id: 'todas', label: 'Todas las Notificaciones' },
                    { id: 'no_leidas', label: `Sin Leer (${unreadCount})` },
                    { id: 'vencimientos', label: 'Vencimientos y Plazos' },
                    { id: 'documentos', label: 'Documentos' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabFiltro)}
                        className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'border-red-500 text-red-400 bg-red-500/5'
                                : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Listado de Notificaciones */}
            <div className="space-y-3">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse h-24"
                        />
                    ))
                ) : filteredNotificaciones.length === 0 ? (
                    <div className="p-12 rounded-2xl bg-[#111827] border border-[#334155] text-center space-y-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">
                            No hay notificaciones en este filtro
                        </h3>
                        <p className="text-xs text-[#94a3b8]">
                            Todas las alertas de este grupo han sido atendidas o no se han generado nuevos vencimientos.
                        </p>
                    </div>
                ) : (
                    filteredNotificaciones.map((notif) => {
                        const targetUrl = notif.id_incapacidad
                            ? `/incapacidades/${notif.id_incapacidad}`
                            : '/transcripciones'

                        return (
                            <div
                                key={notif.id_notificacion}
                                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                    !notif.leida
                                        ? 'bg-[#141d2e] border-blue-500/30 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20'
                                        : 'bg-[#111827] border-[#334155] hover:border-[#475569]'
                                }`}
                            >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                    {getIconForType(notif.tipo_notificacion)}

                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4
                                                className={`text-xs sm:text-sm font-semibold ${
                                                    !notif.leida ? 'text-white' : 'text-[#cbd5e1]'
                                                }`}
                                            >
                                                {notif.titulo}
                                            </h4>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                                                {notif.tipo_notificacion || 'General'}
                                            </span>
                                            {!notif.leida && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                                    Nueva
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-[#94a3b8] leading-relaxed">
                                            {notif.mensaje}
                                        </p>

                                        <div className="text-[10px] text-[#64748b] font-mono pt-0.5">
                                            {notif.created_at
                                                ? new Date(notif.created_at).toLocaleString('es-CO', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : 'Reciente'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    {!notif.leida && (
                                        <button
                                            type="button"
                                            onClick={() => handleMarkAsRead(notif.id_notificacion)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#cbd5e1] bg-[#1f2937] hover:bg-[#374151] border border-[#334155] transition flex items-center gap-1.5"
                                            title="Marcar como leída"
                                        >
                                            <Check className="h-3.5 w-3.5 text-blue-400" />
                                            <span>Marcar leída</span>
                                        </button>
                                    )}

                                    <Link
                                        href={targetUrl}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition flex items-center gap-1"
                                    >
                                        <span>Ir al Expediente</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

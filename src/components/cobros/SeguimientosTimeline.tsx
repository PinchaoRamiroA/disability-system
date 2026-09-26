'use client'

import React from 'react'
import Link from 'next/link'
import {
    PhoneCall,
    Mail,
    Scale,
    FileText,
    User,
    Calendar,
    ArrowUpRight,
} from 'lucide-react'
import type { Seguimiento } from '@/contracts/cobros'
import { TIPOS_SEGUIMIENTO, RESULTADOS_SEGUIMIENTO } from '@/services/cobro.service'

interface SeguimientosTimelineProps {
    seguimientos: Seguimiento[]
    isLoading?: boolean
    onOpenModal?: () => void
    showIncapacidadLink?: boolean
}

export function SeguimientosTimeline({
    seguimientos,
    isLoading = false,
    onOpenModal,
    showIncapacidadLink = true,
}: SeguimientosTimelineProps) {
    if (isLoading) {
        return (
            <div className="p-12 text-center space-y-3">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]" />
                <p className="text-xs text-[#94a3b8]">Cargando línea de tiempo de seguimientos...</p>
            </div>
        )
    }

    if (!seguimientos || seguimientos.length === 0) {
        return (
            <div className="p-12 rounded-2xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                    <PhoneCall className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">
                        Sin seguimientos registrados
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Aún no se han documentado gestiones de cobro o llamadas para este criterio. Inicia registrando un seguimiento persuasivo o llamada con la entidad.
                    </p>
                </div>
                {onOpenModal && (
                    <button
                        type="button"
                        onClick={onOpenModal}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
                    >
                        + Registrar Primer Seguimiento
                    </button>
                )}
            </div>
        )
    }

    const getTypeConfig = (tipo: string) => {
        const found = TIPOS_SEGUIMIENTO.find(
            (t) => t.value.toLowerCase() === tipo.toLowerCase()
        )
        if (found) return found

        // Heuristics for variations
        if (tipo.toLowerCase().includes('jur')) {
            return {
                value: tipo,
                label: 'Cobro Jurídico',
                badgeColor: 'border-red-500/30 text-red-400 bg-red-500/10',
                icon: 'Scale',
            }
        }
        if (tipo.toLowerCase().includes('pers')) {
            return {
                value: tipo,
                label: 'Cobro Persuasivo',
                badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
                icon: 'FileText',
            }
        }
        return {
            value: tipo,
            label: tipo,
            badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
            icon: 'PhoneCall',
        }
    }

    const getOutcomeConfig = (resultado?: string | null) => {
        if (!resultado) {
            return {
                label: 'Sin resultado registrado',
                color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
            }
        }
        const found = RESULTADOS_SEGUIMIENTO.find(
            (r) => r.value.toLowerCase() === resultado.toLowerCase()
        )
        if (found) return found

        return {
            label: resultado,
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        }
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Fecha no especificada'
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return dateStr
            return new Intl.DateTimeFormat('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date)
        } catch {
            return dateStr
        }
    }

    const getRelativeTime = (dateStr?: string) => {
        if (!dateStr) return ''
        try {
            const now = new Date()
            const date = new Date(dateStr)
            const diffTime = now.getTime() - date.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) return 'Hoy'
            if (diffDays === 1) return 'Ayer'
            if (diffDays > 1 && diffDays < 30) return `Hace ${diffDays} días`
            if (diffDays >= 30) {
                const months = Math.floor(diffDays / 30)
                return `Hace ${months} mes${months > 1 ? 'es' : ''}`
            }
            return ''
        } catch {
            return ''
        }
    }

    return (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-purple-500/30 before:to-[#334155]">
            {seguimientos.map((item, index) => {
                const typeConfig = getTypeConfig(item.tipo_seguimiento)
                const outcomeConfig = getOutcomeConfig(item.resultado || item.resultado_seguimiento)
                const dateDisplay = formatDate(item.fecha || item.fecha_contacto || item.created_at)
                const relativeTime = getRelativeTime(item.fecha || item.fecha_contacto || item.created_at)

                // Detect communication icon
                const isPhone = item.descripcion?.toLowerCase().includes('llamada')
                const isMail = item.descripcion?.toLowerCase().includes('correo') || item.descripcion?.toLowerCase().includes('email')
                const isLegal = item.tipo_seguimiento.toLowerCase().includes('jur')

                const Icon = isLegal
                    ? Scale
                    : isMail
                    ? Mail
                    : isPhone
                    ? PhoneCall
                    : FileText

                return (
                    <div
                        key={item.id_seguimiento || index}
                        className="relative group transition-all duration-200"
                    >
                        {/* Timeline Node Point */}
                        <div
                            className={`absolute -left-6 sm:-left-8 top-1.5 h-6 w-6 rounded-full border-2 border-[#0f172a] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                                isLegal
                                    ? 'bg-red-500 text-white shadow-red-500/20'
                                    : typeConfig.value === 'Persuasivo'
                                    ? 'bg-amber-500 text-white shadow-amber-500/20'
                                    : 'bg-blue-600 text-white shadow-blue-500/20'
                            }`}
                        >
                            <Icon className="h-3 w-3" />
                        </div>

                        {/* Card Content */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] hover:border-blue-500/40 transition shadow-sm hover:shadow-md space-y-3">
                            {/* Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Type Pill */}
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeConfig.badgeColor}`}
                                    >
                                        {typeConfig.label}
                                    </span>

                                    {/* Outcome Pill */}
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${outcomeConfig.color}`}
                                    >
                                        {outcomeConfig.label}
                                    </span>

                                    {/* Link to Incapacidad if enabled */}
                                    {showIncapacidadLink && (
                                        <Link
                                            href={`/incapacidades/${item.id_incapacidad}`}
                                            className="px-2 py-0.5 rounded-md bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] text-[11px] font-mono flex items-center gap-1 transition"
                                        >
                                            <span>INC #{item.id_incapacidad}</span>
                                            <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                                        </Link>
                                    )}
                                </div>

                                {/* Date & Relative Time */}
                                <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 opacity-70" />
                                        <span>{dateDisplay}</span>
                                    </div>
                                    {relativeTime && (
                                        <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[10px] text-slate-400 border border-[#334155]">
                                            {relativeTime}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description Narrative */}
                            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]/60 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {item.descripcion || (
                                    <span className="italic text-slate-500">
                                        Sin notas descriptivas registradas.
                                    </span>
                                )}
                            </div>

                            {/* Footer Metadata */}
                            <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-1 border-t border-[#334155]/40">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3 opacity-60" />
                                    <span>
                                        {item.gestionado_por
                                            ? `Gestionado por usuario #${item.gestionado_por}`
                                            : 'Gestionado por equipo de Cartera / Cobros'}
                                    </span>
                                </div>
                                <span className="font-mono text-[10px] text-slate-500">
                                    ID #{item.id_seguimiento}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

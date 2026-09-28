'use client'

import React from 'react'
import Link from 'next/link'
import {
    FileText,
    ArrowUpRight,
    Building2,
    Calendar,
    User as UserIcon,
    ChevronRight,
} from 'lucide-react'
import type { Incapacidad } from '@/contracts/incapacidades'
import type { User } from '@/contracts/auth'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface DashboardRecentTableProps {
    incapacidades: Incapacidad[]
    usuariosMap: Map<number, User>
    isLoading?: boolean
}

export function DashboardRecentTable({
    incapacidades,
    usuariosMap,
    isLoading = false,
}: DashboardRecentTableProps) {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-'
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return dateStr
            return new Intl.DateTimeFormat('es-CO', {
                month: 'short',
                day: 'numeric',
            }).format(date)
        } catch {
            return dateStr
        }
    }

    const calculateDays = (start?: string, end?: string) => {
        if (!start || !end) return 1
        try {
            const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime())
            return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
        } catch {
            return 1
        }
    }

    return (
        <div className="rounded-2xl border border-[#334155] bg-[#111827] shadow-xl overflow-hidden space-y-0">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#334155] bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Últimas Incapacidades Registradas
                        </h3>
                        <p className="text-[11px] text-[#94a3b8]">
                            Monitoreo de radicaciones y novedades médicas recientes
                        </p>
                    </div>
                </div>

                <Link
                    href="/incapacidades"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer self-start sm:self-center"
                >
                    <span>Ver todas las incapacidades</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b border-[#334155] bg-[#111827] text-[#94a3b8] font-semibold uppercase text-[11px]">
                            <th className="py-3 px-4">Incapacidad</th>
                            <th className="py-3 px-4">Colaborador</th>
                            <th className="py-3 px-4">Entidad Pagadora</th>
                            <th className="py-3 px-4">Período / Duración</th>
                            <th className="py-3 px-4 text-center">Estado</th>
                            <th className="py-3 px-4 text-right">Detalle</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]/50 bg-[#111827]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent mb-2" />
                                    <p className="text-xs text-[#94a3b8]">Cargando novedades...</p>
                                </td>
                            </tr>
                        ) : incapacidades.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-400">
                                    <FileText className="h-8 w-8 mx-auto text-[#64748b] mb-2 opacity-50" />
                                    <p className="text-sm font-medium text-white">
                                        No hay incapacidades registradas recientemente
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            incapacidades.slice(0, 7).map((inc) => {
                                const colaborador = inc.id_usuario
                                    ? usuariosMap.get(inc.id_usuario)
                                    : undefined
                                const dias = calculateDays(inc.fecha_inicio, inc.fecha_fin)

                                // Fallback nombre colaborador
                                let nombre = colaborador?.nombre || ''
                                if (!nombre && inc.titulo) {
                                    const parts = inc.titulo.split('-')
                                    nombre = parts.length > 1 ? parts[1].trim() : inc.titulo
                                }
                                if (!nombre) nombre = `Colaborador #${inc.id_usuario}`

                                return (
                                    <tr
                                        key={inc.id_incapacidad}
                                        className="hover:bg-[#1e293b]/40 transition group"
                                    >
                                        {/* ID & Title */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-blue-400">
                                                    INC #{inc.id_incapacidad}
                                                </span>
                                            </div>
                                            <p className="text-white font-medium truncate max-w-[200px] mt-0.5" title={inc.titulo}>
                                                {inc.titulo}
                                            </p>
                                        </td>

                                        {/* Colaborador */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 font-medium text-slate-200">
                                                <UserIcon className="h-3 w-3 text-[#64748b]" />
                                                <span className="truncate max-w-[170px]" title={nombre}>
                                                    {nombre}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">
                                                C.C. {colaborador?.numero_documento || 'Sin doc'}
                                            </div>
                                        </td>

                                        {/* Entidad */}
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="h-3.5 w-3.5 text-[#64748b]" />
                                                <span className="font-medium text-slate-200">
                                                    {inc.entidad?.nombre || 'EPS'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-[#94a3b8] uppercase font-mono">
                                                {inc.entidad?.tipo || 'EPS'}
                                            </span>
                                        </td>

                                        {/* Fechas / Días */}
                                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                                            <div className="flex items-center gap-1 text-slate-300">
                                                <Calendar className="h-3 w-3 text-[#64748b]" />
                                                <span>
                                                    {formatDate(inc.fecha_inicio)} - {formatDate(inc.fecha_fin)}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-[#94a3b8] mt-0.5">
                                                <span className="font-bold text-slate-300">{dias}</span> día(s)
                                            </div>
                                        </td>

                                        {/* Estado */}
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            <StatusBadge status={inc.estado?.nombre || 'Recibida'} />
                                        </td>

                                        {/* Acción */}
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <Link
                                                href={`/incapacidades/${inc.id_incapacidad}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0f172a] hover:bg-blue-600 border border-[#334155] text-slate-300 hover:text-white transition font-medium"
                                                title="Ver detalle completo"
                                            >
                                                <span>Ver</span>
                                                <ArrowUpRight className="h-3 w-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

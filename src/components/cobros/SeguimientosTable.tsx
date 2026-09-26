'use client'

import React from 'react'
import Link from 'next/link'
import {
    ArrowUpRight,
    Eye,
} from 'lucide-react'
import type { Seguimiento } from '@/contracts/cobros'
import { TIPOS_SEGUIMIENTO, RESULTADOS_SEGUIMIENTO } from '@/services/cobro.service'

interface SeguimientosTableProps {
    seguimientos: Seguimiento[]
    isLoading?: boolean
    onOpenModal?: () => void
}

export function SeguimientosTable({
    seguimientos,
    isLoading = false,
    onOpenModal,
}: SeguimientosTableProps) {
    if (isLoading) {
        return (
            <div className="p-12 text-center space-y-3">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]" />
                <p className="text-xs text-[#94a3b8]">Cargando seguimientos...</p>
            </div>
        )
    }

    if (!seguimientos || seguimientos.length === 0) {
        return (
            <div className="p-12 rounded-2xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <p className="text-xs text-[#94a3b8]">No hay seguimientos para mostrar en la tabla.</p>
                {onOpenModal && (
                    <button
                        type="button"
                        onClick={onOpenModal}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition"
                    >
                        + Registrar Seguimiento
                    </button>
                )}
            </div>
        )
    }

    const getTypeBadge = (tipo: string) => {
        const found = TIPOS_SEGUIMIENTO.find(
            (t) => t.value.toLowerCase() === tipo.toLowerCase()
        )
        const badgeColor = found?.badgeColor || 'border-blue-500/30 text-blue-400 bg-blue-500/10'
        const label = found?.label || tipo

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                {label}
            </span>
        )
    }

    const getOutcomeBadge = (resultado?: string | null) => {
        if (!resultado) {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border text-slate-400 bg-slate-500/10 border-slate-500/20">
                    Sin resultado
                </span>
            )
        }
        const found = RESULTADOS_SEGUIMIENTO.find(
            (r) => r.value.toLowerCase() === resultado.toLowerCase()
        )
        const color = found?.color || 'text-blue-400 bg-blue-500/10 border-blue-500/20'

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${color}`}>
                {found?.label || resultado}
            </span>
        )
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-'
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return dateStr
            return new Intl.DateTimeFormat('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(date)
        } catch {
            return dateStr
        }
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-[#111827]">
            <table className="w-full text-left border-collapse text-xs">
                <thead>
                    <tr className="border-b border-[#334155] bg-[#0f172a] text-[#94a3b8] font-semibold">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Incapacidad</th>
                        <th className="py-3 px-4">Tipo Gestión</th>
                        <th className="py-3 px-4">Resultado</th>
                        <th className="py-3 px-4 min-w-[280px]">Detalle / Acuerdos</th>
                        <th className="py-3 px-4">Fecha Gestión</th>
                        <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60">
                    {seguimientos.map((item) => (
                        <tr
                            key={item.id_seguimiento}
                            className="hover:bg-[#1e293b]/40 transition group"
                        >
                            <td className="py-3 px-4 font-mono text-slate-400">
                                #{item.id_seguimiento}
                            </td>
                            <td className="py-3 px-4">
                                <Link
                                    href={`/incapacidades/${item.id_incapacidad}`}
                                    className="font-mono font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline"
                                >
                                    <span>INC #{item.id_incapacidad}</span>
                                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                                </Link>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                                {getTypeBadge(item.tipo_seguimiento)}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                                {getOutcomeBadge(item.resultado || item.resultado_seguimiento)}
                            </td>
                            <td className="py-3 px-4 text-slate-300 max-w-md">
                                <p className="line-clamp-2 leading-relaxed">
                                    {item.descripcion || <span className="text-slate-500 italic">Sin detalle</span>}
                                </p>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                                {formatDate(item.fecha || item.fecha_contacto || item.created_at)}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                <Link
                                    href={`/incapacidades/${item.id_incapacidad}?tab=seguimientos`}
                                    className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] inline-flex items-center gap-1 transition text-[11px]"
                                    title="Ver expediente de incapacidad"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>Ver</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

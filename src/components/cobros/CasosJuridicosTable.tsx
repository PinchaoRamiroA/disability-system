'use client'

import React from 'react'
import Link from 'next/link'
import {
    Scale,
    AlertTriangle,
    ArrowUpRight,
    Eye,
    Plus,
    Clock,
    Building2,
} from 'lucide-react'
import type { CasoJuridicoItem } from '@/services/cartera.service'

interface CasosJuridicosTableProps {
    casos: CasoJuridicoItem[]
    isLoading?: boolean
    onOpenEscalacion?: () => void
    onOpenSeguimiento?: (idIncapacidad: number, titulo: string, entidad: string) => void
}

export function CasosJuridicosTable({
    casos,
    isLoading = false,
    onOpenEscalacion,
    onOpenSeguimiento,
}: CasosJuridicosTableProps) {
    if (isLoading) {
        return (
            <div className="p-12 text-center space-y-3">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent align-[-0.125em]" />
                <p className="text-xs text-[#94a3b8]">Cargando expedientes jurídicos y casos críticos...</p>
            </div>
        )
    }

    if (!casos || casos.length === 0) {
        return (
            <div className="p-12 rounded-2xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                    <Scale className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">
                        No hay casos en cobro jurídico
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        No se registran casos con escalación legal activa según los filtros seleccionados. Puedes escalar casos con mora prolongada desde el botón superior.
                    </p>
                </div>
                {onOpenEscalacion && (
                    <button
                        type="button"
                        onClick={onOpenEscalacion}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                    >
                        + Escalar Primer Caso a Jurídico
                    </button>
                )}
            </div>
        )
    }

    const formatCurrency = (val: string | number) => {
        const num = typeof val === 'number' ? val : parseFloat(val) || 0
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(num)
    }

    const getMoraBadge = (dias: number) => {
        if (dias >= 180) {
            return (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>{dias} días (&gt;180)</span>
                </span>
            )
        }
        if (dias >= 90) {
            return (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{dias} días (&gt;90)</span>
                </span>
            )
        }
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                {dias} días
            </span>
        )
    }

    const getEstadoJuridicoBadge = (estado: string) => {
        const lower = estado.toLowerCase()
        if (lower.includes('favor') || lower.includes('aprob') || lower.includes('acuerdo')) {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {estado}
                </span>
            )
        }
        if (lower.includes('tutela') || lower.includes('desacato')) {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {estado}
                </span>
            )
        }
        if (lower.includes('rechaz') || lower.includes('glosa')) {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {estado}
                </span>
            )
        }
        return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                {estado}
            </span>
        )
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-[#111827]">
            <table className="w-full text-left border-collapse text-xs">
                <thead>
                    <tr className="border-b border-[#334155] bg-[#0f172a] text-[#94a3b8] font-semibold">
                        <th className="py-3 px-4">Incapacidad</th>
                        <th className="py-3 px-4">Colaborador / Paciente</th>
                        <th className="py-3 px-4">Entidad Deudora</th>
                        <th className="py-3 px-4">Días en Mora</th>
                        <th className="py-3 px-4">Valor Adeudado</th>
                        <th className="py-3 px-4 min-w-[200px]">Estado Jurídico / Actuación</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60">
                    {casos.map((caso) => (
                        <tr
                            key={caso.id_incapacidad}
                            className="hover:bg-[#1e293b]/40 transition group"
                        >
                            {/* Incapacidad Link & Title */}
                            <td className="py-3 px-4">
                                <Link
                                    href={`/incapacidades/${caso.id_incapacidad}`}
                                    className="font-mono font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline w-fit"
                                >
                                    <span>INC #{caso.id_incapacidad}</span>
                                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                                </Link>
                                <p className="font-medium text-white truncate max-w-[180px] mt-0.5">
                                    {caso.titulo}
                                </p>
                            </td>

                            {/* Colaborador */}
                            <td className="py-3 px-4 text-slate-300">
                                <p className="font-medium text-white">{caso.colaborador || 'Colaborador'}</p>
                                <span className="text-[11px] text-[#94a3b8]">
                                    {caso.tipo_incapacidad}
                                </span>
                            </td>

                            {/* Entidad Deudora */}
                            <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    <span className="font-medium text-slate-200">
                                        {caso.entidad}
                                    </span>
                                </div>
                                <span className="text-[10px] text-[#94a3b8] uppercase font-mono">
                                    {caso.tipo_entidad}
                                </span>
                            </td>

                            {/* Días Mora Badge */}
                            <td className="py-3 px-4 whitespace-nowrap">
                                {getMoraBadge(caso.dias_mora)}
                            </td>

                            {/* Valor Adeudado */}
                            <td className="py-3 px-4 whitespace-nowrap">
                                <span className="font-mono font-semibold text-emerald-400 text-xs">
                                    {formatCurrency(caso.valor_adeudado)}
                                </span>
                            </td>

                            {/* Estado Jurídico */}
                            <td className="py-3 px-4 max-w-xs">
                                <div className="space-y-1">
                                    {getEstadoJuridicoBadge(caso.estado_juridico)}
                                    {caso.ultima_actuacion?.descripcion && (
                                        <p className="text-[11px] text-[#94a3b8] line-clamp-1 italic">
                                            {caso.ultima_actuacion.descripcion}
                                        </p>
                                    )}
                                </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                    {onOpenSeguimiento && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onOpenSeguimiento(
                                                    caso.id_incapacidad,
                                                    caso.titulo,
                                                    caso.entidad
                                                )
                                            }
                                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] flex items-center gap-1 transition"
                                            title="Registrar actuación jurídica"
                                        >
                                            <Plus className="h-3 w-3" />
                                            <span className="hidden sm:inline">Actuación</span>
                                        </button>
                                    )}

                                    <Link
                                        href={`/incapacidades/${caso.id_incapacidad}?tab=seguimientos`}
                                        className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] inline-flex items-center gap-1 transition text-[11px]"
                                        title="Ver expediente completo"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Expediente</span>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

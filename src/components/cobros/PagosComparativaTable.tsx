'use client'

import React from 'react'
import Link from 'next/link'
import {
    CreditCard,
    ArrowUpRight,
    Eye,
    CheckCircle2,
    AlertTriangle,
    Building2,
    ShieldCheck,
    Check,
} from 'lucide-react'
import type { Pago } from '@/contracts/cobros'
import type { Incapacidad } from '@/contracts/incapacidades'
import { ESTADOS_PAGO } from '@/services/cobro.service'

interface PagosComparativaTableProps {
    pagos: Pago[]
    incapacidadesMap?: Map<number, Incapacidad>
    isLoading?: boolean
    onOpenModal?: () => void
    onConciliar?: (idPago: number) => void
}

export function PagosComparativaTable({
    pagos,
    incapacidadesMap,
    isLoading = false,
    onOpenModal,
    onConciliar,
}: PagosComparativaTableProps) {
    if (isLoading) {
        return (
            <div className="p-12 text-center space-y-3">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent align-[-0.125em]" />
                <p className="text-xs text-[#94a3b8]">Cargando pagos y análisis comparativo...</p>
            </div>
        )
    }

    if (!pagos || pagos.length === 0) {
        return (
            <div className="p-12 rounded-2xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <CreditCard className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">
                        No hay pagos registrados
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Aún no se han registrado giros o pagos de incapacidades según los filtros seleccionados. Puedes registrar una consignación bancaria con el botón superior.
                    </p>
                </div>
                {onOpenModal && (
                    <button
                        type="button"
                        onClick={onOpenModal}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
                    >
                        + Registrar Primer Pago
                    </button>
                )}
            </div>
        )
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(val)
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-'
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

    const getEstadoBadge = (estado: string) => {
        const found = ESTADOS_PAGO.find(
            (e) => e.value.toLowerCase() === estado.toLowerCase()
        )
        const color = found?.color || 'text-slate-400 bg-slate-500/10 border-slate-500/20'
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${color}`}>
                {found?.label || estado}
            </span>
        )
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-[#111827]">
            <table className="w-full text-left border-collapse text-xs">
                <thead>
                    <tr className="border-b border-[#334155] bg-[#0f172a] text-[#94a3b8] font-semibold">
                        <th className="py-3 px-4">Pago & Ref</th>
                        <th className="py-3 px-4">Incapacidad</th>
                        <th className="py-3 px-4">Entidad Pagadora</th>
                        <th className="py-3 px-4">Fecha & Periodo</th>
                        <th className="py-3 px-4 text-right">Valor Esperado</th>
                        <th className="py-3 px-4 text-right">Valor Recibido</th>
                        <th className="py-3 px-4 text-center">Diferencia / Glosa</th>
                        <th className="py-3 px-4 text-center">Estado Pago</th>
                        <th className="py-3 px-4 text-center">Conciliado</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60">
                    {pagos.map((pago) => {
                        const inc = incapacidadesMap?.get(pago.id_incapacidad)
                        const valorRecibido = parseFloat(pago.valor) || 0

                        // Expected calculation: if incapacity has dates or if pago is partial
                        let valorEsperado = valorRecibido
                        if (pago.estado_pago === 'Parcial') {
                            // If partial, expected is higher (e.g. 25-30% glosado)
                            valorEsperado = Math.round(valorRecibido * 1.35)
                        } else if (inc?.fecha_inicio && inc?.fecha_fin) {
                            const diffDays = Math.max(
                                1,
                                Math.floor(
                                    (new Date(inc.fecha_fin).getTime() -
                                        new Date(inc.fecha_inicio).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                ) + 1
                            )
                            // Estimate subsidio based on days (e.g. ~$55.000/day)
                            const estimated = diffDays * 55000
                            valorEsperado = Math.max(valorRecibido, estimated)
                        }

                        const diferencia = valorEsperado - valorRecibido
                        const ratio = valorEsperado > 0 ? (valorRecibido / valorEsperado) * 100 : 100

                        return (
                            <tr
                                key={pago.id_pago}
                                className="hover:bg-[#1e293b]/40 transition group"
                            >
                                {/* ID Pago & Ref */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="font-mono font-semibold text-emerald-400">
                                        PAG #{pago.id_pago}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                                        {pago.descripcion?.match(/\[Ref:\s*([^\]]+)\]/)?.[1] ||
                                            pago.tipo_pago}
                                    </div>
                                </td>

                                {/* Incapacidad */}
                                <td className="py-3 px-4">
                                    <Link
                                        href={`/incapacidades/${pago.id_incapacidad}`}
                                        className="font-mono font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline w-fit"
                                    >
                                        <span>INC #{pago.id_incapacidad}</span>
                                        <ArrowUpRight className="h-3 w-3 opacity-60" />
                                    </Link>
                                    <p className="text-white truncate max-w-[170px] mt-0.5">
                                        {inc?.titulo || 'Incapacidad médica'}
                                    </p>
                                </td>

                                {/* Entidad */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                        <span className="font-medium text-slate-200">
                                            {pago.nombre_entidad || inc?.entidad?.nombre || 'EPS'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-[#94a3b8] uppercase font-mono">
                                        {inc?.entidad?.tipo || 'EPS'}
                                    </span>
                                </td>

                                {/* Fecha & Periodo */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                    <span className="text-slate-300 font-medium block">
                                        {formatDate(pago.fecha_pago)}
                                    </span>
                                    {pago.periodo_contable && (
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Periodo: {pago.periodo_contable}
                                        </span>
                                    )}
                                </td>

                                {/* Valor Esperado */}
                                <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-slate-300">
                                    {formatCurrency(valorEsperado)}
                                </td>

                                {/* Valor Recibido */}
                                <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-emerald-400">
                                    {formatCurrency(valorRecibido)}
                                </td>

                                {/* Diferencia / Glosa */}
                                <td className="py-3 px-4 whitespace-nowrap text-center">
                                    {diferencia <= 0 ? (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                                            <span>Completo (100%)</span>
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3 shrink-0" />
                                            <span>-{formatCurrency(diferencia)} ({Math.round(ratio)}%)</span>
                                        </span>
                                    )}
                                </td>

                                {/* Estado de Pago */}
                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                    {getEstadoBadge(pago.estado_pago)}
                                </td>

                                {/* Conciliado */}
                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                    {pago.conciliado ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" />
                                            <span>Sí</span>
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                            No
                                        </span>
                                    )}
                                </td>

                                {/* Acciones */}
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                        {!pago.conciliado && onConciliar && (
                                            <button
                                                type="button"
                                                onClick={() => onConciliar(pago.id_pago)}
                                                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[11px] inline-flex items-center gap-1 transition"
                                                title="Conciliar pago"
                                            >
                                                <Check className="h-3 w-3" />
                                                <span className="hidden sm:inline">Conciliar</span>
                                            </button>
                                        )}

                                        <Link
                                            href={`/incapacidades/${pago.id_incapacidad}?tab=pagos`}
                                            className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] inline-flex items-center gap-1 transition text-[11px]"
                                            title="Ver expediente y soportes"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>Ver</span>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

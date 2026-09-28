'use client'

import React from 'react'
import {
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
} from 'lucide-react'

interface DashboardKPICardsProps {
    totalActivas: number
    totalPendientes: number
    totalPagadas: number
    totalRechazadas: number
    isLoading?: boolean
}

export function DashboardKPICards({
    totalActivas,
    totalPendientes,
    totalPagadas,
    totalRechazadas,
    isLoading = false,
}: DashboardKPICardsProps) {
    const kpis = [
        {
            title: 'Incapacidades Activas',
            value: totalActivas,
            subtitle: 'En proceso o vigentes en la empresa',
            icon: Activity,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            trendText: 'Gestión activa',
            trendIcon: TrendingUp,
            trendColor: 'text-blue-400',
        },
        {
            title: 'Pendientes de Gestión',
            value: totalPendientes,
            subtitle: 'Pendiente transcripción o validación',
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            trendText: 'Requiere atención',
            trendIcon: TrendingUp,
            trendColor: 'text-amber-400',
        },
        {
            title: 'Pagadas / Recaudadas',
            value: totalPagadas,
            subtitle: 'Subsidio económico reconocido',
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            trendText: 'Flujo efectivo',
            trendIcon: TrendingUp,
            trendColor: 'text-emerald-400',
        },
        {
            title: 'Rechazadas / Glosadas',
            value: totalRechazadas,
            subtitle: 'Negadas o en objeción con entidad',
            icon: XCircle,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            trendText: 'Riesgo de pérdida',
            trendIcon: TrendingDown,
            trendColor: 'text-rose-400',
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon
                const TrendIcon = kpi.trendIcon

                return (
                    <div
                        key={kpi.title}
                        className={`p-5 rounded-2xl bg-[#111827] border ${kpi.border} shadow-lg shadow-black/20 hover:border-slate-500 transition-all duration-200 flex flex-col justify-between`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                                    {kpi.title}
                                </span>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-[#1e293b] animate-pulse rounded mt-1" />
                                ) : (
                                    <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                                        {kpi.value.toLocaleString('es-CO')}
                                    </div>
                                )}
                            </div>
                            <div className={`p-2.5 rounded-xl ${kpi.bg} border ${kpi.border} ${kpi.color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-[11px]">
                            <span className="text-[#94a3b8] truncate max-w-[170px]" title={kpi.subtitle}>
                                {kpi.subtitle}
                            </span>
                            <span className={`font-semibold flex items-center gap-1 ${kpi.trendColor}`}>
                                <TrendIcon className="h-3 w-3" />
                                <span>{kpi.trendText}</span>
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

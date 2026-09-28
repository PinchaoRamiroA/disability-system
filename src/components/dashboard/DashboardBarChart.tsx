'use client'

import React, { useMemo } from 'react'
import { Building2, BarChart2 } from 'lucide-react'

export interface EntityBarItem {
    nombre: string
    tipo: string
    count: number
    percentage: number
    color: string
}

interface DashboardBarChartProps {
    entidadCounts: Record<string, { count: number; tipo: string }>
    total: number
    isLoading?: boolean
}

// Brand-like colors for major healthcare entities
const ENTITY_COLOR_PALETTE = [
    { from: 'from-blue-600', to: 'to-blue-400', hex: '#3b82f6' },
    { from: 'from-cyan-600', to: 'to-teal-400', hex: '#06b6d4' },
    { from: 'from-purple-600', to: 'to-indigo-400', hex: '#8b5cf6' },
    { from: 'from-amber-600', to: 'to-yellow-400', hex: '#f59e0b' },
    { from: 'from-emerald-600', to: 'to-green-400', hex: '#10b981' },
    { from: 'from-rose-600', to: 'to-pink-400', hex: '#f43f5e' },
]

export function DashboardBarChart({
    entidadCounts,
    total,
    isLoading = false,
}: DashboardBarChartProps) {
    const bars: EntityBarItem[] = useMemo(() => {
        const entries = Object.entries(entidadCounts).filter(([, item]) => item.count > 0)
        // Sort descending
        entries.sort((a, b) => b[1].count - a[1].count)

        // Take top 6 entities
        return entries.slice(0, 6).map(([nombre, item], idx) => {
            const palette = ENTITY_COLOR_PALETTE[idx % ENTITY_COLOR_PALETTE.length]
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0

            return {
                nombre,
                tipo: item.tipo || 'EPS',
                count: item.count,
                percentage,
                color: palette.hex,
            }
        })
    }, [entidadCounts, total])

    return (
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] shadow-xl space-y-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <BarChart2 className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Concentración por Entidad
                        </h3>
                        <p className="text-[11px] text-[#94a3b8]">
                            Volumen de incapacidades radicadas ante EPS / ARL
                        </p>
                    </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 px-2 py-0.5 rounded-full bg-[#1e293b] border border-[#334155]">
                    {bars.length} Entidades
                </span>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent" />
                </div>
            ) : bars.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-[#64748b]">
                    <Building2 className="h-10 w-10 opacity-40" />
                    <p className="text-xs text-[#94a3b8]">No hay datos de entidades para mostrar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bars.map((bar) => {
                        return (
                            <div key={bar.nombre} className="space-y-1.5 group">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Building2 className="h-3.5 w-3.5 text-[#64748b] group-hover:text-white transition shrink-0" />
                                        <span className="font-medium text-white truncate max-w-[180px]" title={bar.nombre}>
                                            {bar.nombre}
                                        </span>
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                                            {bar.tipo}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 font-mono">
                                        <span className="font-bold text-white">
                                            {bar.count} casos
                                        </span>
                                        <span className="text-[11px] text-[#94a3b8] w-8 text-right">
                                            {bar.percentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Animated Bar */}
                                <div className="w-full bg-[#0f172a] h-2.5 rounded-full overflow-hidden border border-[#334155]/40">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${Math.max(4, bar.percentage)}%`,
                                            backgroundColor: bar.color,
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

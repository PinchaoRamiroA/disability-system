'use client'

import React, { useState, useMemo } from 'react'
import { PieChart as PieChartIcon } from 'lucide-react'

export interface StateCountItem {
    nombre: string
    count: number
    color: string
    bgLight: string
}

interface DashboardPieChartProps {
    estadoCounts: Record<string, number>
    total: number
    isLoading?: boolean
}

// Visual color configuration for known disability states
const STATE_COLORS: Record<string, { color: string; bgLight: string }> = {
    recibida: { color: '#3b82f6', bgLight: 'rgba(59, 130, 246, 0.15)' },
    transcrita: { color: '#06b6d4', bgLight: 'rgba(6, 182, 212, 0.15)' },
    cobrada: { color: '#a855f7', bgLight: 'rgba(168, 85, 247, 0.15)' },
    pagada: { color: '#10b981', bgLight: 'rgba(16, 185, 129, 0.15)' },
    rechazada: { color: '#f43f5e', bgLight: 'rgba(244, 63, 94, 0.15)' },
    pendiente: { color: '#f59e0b', bgLight: 'rgba(245, 158, 11, 0.15)' },
    validacion: { color: '#eab308', bgLight: 'rgba(234, 179, 8, 0.15)' },
    juridico: { color: '#ef4444', bgLight: 'rgba(239, 68, 68, 0.15)' },
    conciliada: { color: '#14b8a6', bgLight: 'rgba(20, 184, 166, 0.15)' },
    otros: { color: '#64748b', bgLight: 'rgba(100, 116, 139, 0.15)' },
}

export function DashboardPieChart({
    estadoCounts,
    total,
    isLoading = false,
}: DashboardPieChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // Format slices and compute percentages
    const slices = useMemo(() => {
        const items: StateCountItem[] = []
        const entries = Object.entries(estadoCounts).filter(([, count]) => count > 0)

        // Sort descending by count
        entries.sort((a, b) => b[1] - a[1])

        entries.forEach(([name, count]) => {
            const lower = name.toLowerCase()
            let conf = STATE_COLORS.otros
            if (lower.includes('recib')) conf = STATE_COLORS.recibida
            else if (lower.includes('transcri')) conf = STATE_COLORS.transcrita
            else if (lower.includes('cobra')) conf = STATE_COLORS.cobrada
            else if (lower.includes('paga')) conf = STATE_COLORS.pagada
            else if (lower.includes('recha')) conf = STATE_COLORS.rechazada
            else if (lower.includes('jurid') || lower.includes('juríd')) conf = STATE_COLORS.juridico
            else if (lower.includes('concilia')) conf = STATE_COLORS.conciliada
            else if (lower.includes('valid') || lower.includes('verific')) conf = STATE_COLORS.validacion
            else if (lower.includes('pend')) conf = STATE_COLORS.pendiente

            items.push({
                nombre: name,
                count,
                color: conf.color,
                bgLight: conf.bgLight,
            })
        })

        return items
    }, [estadoCounts])

    // SVG geometry calculations (Donut Chart)
    const radius = 68
    const strokeWidth = 24
    const circumference = 2 * Math.PI * radius // ~427.25

    let accumulatedOffset = 0
    const sliceElements = slices.map((slice, index) => {
        const percentage = total > 0 ? slice.count / total : 0
        const strokeDasharray = `${percentage * circumference} ${circumference}`
        const strokeDashoffset = -accumulatedOffset
        accumulatedOffset += percentage * circumference

        const isHovered = hoveredIndex === index

        return {
            ...slice,
            strokeDasharray,
            strokeDashoffset,
            percentage: Math.round(percentage * 100),
            isHovered,
        }
    })

    return (
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] shadow-xl space-y-5 flex flex-col justify-between">
            {/* Title */}
            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <PieChartIcon className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Distribución por Estados
                        </h3>
                        <p className="text-[11px] text-[#94a3b8]">
                            Flujo operativo de casos en el ciclo de vida
                        </p>
                    </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 px-2 py-0.5 rounded-full bg-[#1e293b] border border-[#334155]">
                    {total} Total
                </span>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-solid border-purple-500 border-r-transparent" />
                </div>
            ) : total === 0 || slices.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-[#64748b]">
                    <PieChartIcon className="h-10 w-10 opacity-40" />
                    <p className="text-xs text-[#94a3b8]">No hay casos registrados para graficar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* SVG Interactive Donut */}
                    <div className="relative flex items-center justify-center">
                        <svg
                            className="w-48 h-48 transform -rotate-90"
                            viewBox="0 0 180 180"
                        >
                            {/* Background Track */}
                            <circle
                                cx="90"
                                cy="90"
                                r={radius}
                                fill="transparent"
                                stroke="#1e293b"
                                strokeWidth={strokeWidth}
                            />
                            {/* Slices */}
                            {sliceElements.map((slice, idx) => (
                                <circle
                                    key={slice.nombre}
                                    cx="90"
                                    cy="90"
                                    r={radius}
                                    fill="transparent"
                                    stroke={slice.color}
                                    strokeWidth={slice.isHovered ? strokeWidth + 4 : strokeWidth}
                                    strokeDasharray={slice.strokeDasharray}
                                    strokeDashoffset={slice.strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-300 cursor-pointer"
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                />
                            ))}
                        </svg>

                        {/* Center Metric */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                            {hoveredIndex !== null && sliceElements[hoveredIndex] ? (
                                <>
                                    <span
                                        className="text-2xl font-bold font-mono tracking-tight"
                                        style={{ color: sliceElements[hoveredIndex].color }}
                                    >
                                        {sliceElements[hoveredIndex].count}
                                    </span>
                                    <span className="text-[10px] text-slate-300 font-medium truncate max-w-[90px]">
                                        {sliceElements[hoveredIndex].percentage}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl font-bold font-mono text-white tracking-tight">
                                        {total}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-[#94a3b8] tracking-wider">
                                        Casos
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#334155]">
                        {sliceElements.map((slice, idx) => {
                            const isHovered = hoveredIndex === idx
                            return (
                                <div
                                    key={slice.nombre}
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`p-2 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                                        isHovered
                                            ? 'bg-[#1e293b] border-slate-400'
                                            : 'bg-[#0f172a]/60 border-[#334155]/60 hover:bg-[#1e293b]/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div
                                            className="h-2.5 w-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: slice.color }}
                                        />
                                        <span className="text-xs font-medium text-white truncate max-w-[130px]" title={slice.nombre}>
                                            {slice.nombre}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-right shrink-0">
                                        <span className="text-xs font-mono font-bold text-slate-200">
                                            {slice.count}
                                        </span>
                                        <span className="text-[10px] font-mono text-[#94a3b8] w-8">
                                            {slice.percentage}%
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import React from 'react'
import {
    Scale,
    AlertTriangle,
    Building2,
    DollarSign,
} from 'lucide-react'
import type { ResumenEntidadData } from '@/services/cartera.service'

interface JuridicoKPICardsProps {
    totalCasos: number
    casosCriticos180: number
    valorTotalLitigio: number
    topEntidadIncumplida?: ResumenEntidadData | null
}

export function JuridicoKPICards({
    totalCasos,
    casosCriticos180,
    valorTotalLitigio,
    topEntidadIncumplida,
}: JuridicoKPICardsProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(val)
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Casos Jurídicos */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-red-500/30 transition">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8] font-medium">
                        Casos Jurídicos Activos
                    </span>
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                        <Scale className="h-4 w-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                    {totalCasos}
                </div>
                <p className="text-[11px] text-slate-400">
                    En tutela, demanda o SuperSalud
                </p>
            </div>

            {/* Card 2: Casos > 180 Días */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-red-500/30 transition">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8] font-medium">
                        Casos Críticos (&gt;180 Días)
                    </span>
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-red-400 tracking-tight flex items-baseline gap-1.5">
                    <span>{casosCriticos180}</span>
                    <span className="text-xs font-normal text-slate-400">en mora severa</span>
                </div>
                <p className="text-[11px] text-slate-400">
                    Prioridad máxima de recobro
                </p>
            </div>

            {/* Card 3: EPS Mayor Incumplimiento */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-amber-500/30 transition">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8] font-medium">
                        Mayor Incumplimiento
                    </span>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <Building2 className="h-4 w-4" />
                    </div>
                </div>
                <div className="truncate">
                    <p className="text-lg font-bold text-amber-400 truncate">
                        {topEntidadIncumplida?.nombre || 'EPS Sanitas / SURA'}
                    </p>
                </div>
                <p className="text-[11px] text-slate-400">
                    {topEntidadIncumplida?.pagos_vencidos
                        ? `${topEntidadIncumplida.pagos_vencidos} cobros en mora acumulada`
                        : 'Entidad con más días en mora'}
                </p>
            </div>

            {/* Card 4: Valor Total en Litigio */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-emerald-500/30 transition">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8] font-medium">
                        Valor Total en Litigio
                    </span>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <DollarSign className="h-4 w-4" />
                    </div>
                </div>
                <div className="text-xl font-bold text-emerald-400 tracking-tight">
                    {formatCurrency(valorTotalLitigio)}
                </div>
                <p className="text-[11px] text-slate-400">
                    Cartera en proceso de recuperación
                </p>
            </div>
        </div>
    )
}

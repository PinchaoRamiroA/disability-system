'use client'

import React from 'react'
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, Sparkles, Building, Landmark } from 'lucide-react'

interface SemaphoreProps {
    statusName: string
    diasTranscurridos?: number
    diasTotales?: number
    origen?: string
    alertas?: string[]
}

export function IncapacidadStatusSemaphore({
    statusName,
    diasTranscurridos = 0,
    diasTotales = 0,
    origen = 'enfermedad_general',
    alertas = [],
}: SemaphoreProps) {
    const s = statusName.toLowerCase()

    // Determine semaphore color tier
    let tier: 'green' | 'amber' | 'red' | 'gray' = 'amber'
    if (
        s.includes('aprob') ||
        s.includes('transcrit') ||
        s.includes('pagad') ||
        s.includes('conciliad') ||
        s.includes('cerrad')
    ) {
        tier = 'green'
    } else if (
        s.includes('rechaz') ||
        s.includes('vencid') ||
        s.includes('juridic')
    ) {
        tier = 'red'
    } else if (s.includes('archiv')) {
        tier = 'gray'
    } else {
        tier = 'amber'
    }

    // Determine Colombian legal coverage tier
    const days = diasTotales > 0 ? diasTotales : diasTranscurridos
    let legalResponsible = 'Empleador'
    let legalPercentage = '100% Salario'
    let legalEntityBadge = 'Primeros 2 días'
    let responsibleIcon = <Building className="h-4 w-4 text-blue-400" />

    if (origen.includes('trabajo') || origen.includes('laboral')) {
        legalResponsible = 'ARL (Administradora de Riesgos Laborales)'
        legalPercentage = '100% IBC'
        legalEntityBadge = 'Cobertura ARL 100%'
        responsibleIcon = <ShieldAlert className="h-4 w-4 text-orange-400" />
    } else if (days > 180) {
        legalResponsible = 'Fondo de Pensiones (AFP)'
        legalPercentage = '50% - 66.67% IBC (Concepto Favorable)'
        legalEntityBadge = 'Supera 180 días (AFP)'
        responsibleIcon = <Landmark className="h-4 w-4 text-purple-400" />
    } else if (days >= 3) {
        legalResponsible = 'EPS (Entidad Promotora de Salud)'
        legalPercentage = '66.67% IBC (Días 3 a 90)'
        legalEntityBadge = 'Días 3 a 180 (EPS)'
        responsibleIcon = <Building className="h-4 w-4 text-emerald-400" />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Semáforo de Estado */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center gap-3.5">
                <div className={`p-3 rounded-xl shrink-0 ${
                    tier === 'green'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : tier === 'red'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : tier === 'gray'
                        ? 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                    {tier === 'green' ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : tier === 'red' ? (
                        <AlertCircle className="h-5 w-5" />
                    ) : (
                        <Clock className="h-5 w-5" />
                    )}
                </div>
                <div>
                    <span className="text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold block">
                        Semáforo de Estado
                    </span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                        {statusName}
                    </span>
                    <span className={`text-[11px] font-medium inline-block mt-0.5 ${
                        tier === 'green'
                            ? 'text-emerald-400'
                            : tier === 'red'
                            ? 'text-red-400'
                            : 'text-amber-400'
                    }`}>
                        {tier === 'green' ? 'En regla y regularizado' : tier === 'red' ? 'Acción urgente requerida' : 'En proceso de gestión'}
                    </span>
                </div>
            </div>

            {/* Box 2: Días Transcurridos y Duración */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center gap-3.5">
                <div className="p-3 rounded-xl shrink-0 bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    <Clock className="h-5 w-5" />
                </div>
                <div>
                    <span className="text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold block">
                        Días & Duración
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg font-bold text-white">
                            {diasTotales > 0 ? `${diasTotales} días` : `${diasTranscurridos} transcurridos`}
                        </span>
                        {diasTranscurridos > 0 && diasTotales > 0 && (
                            <span className="text-xs text-[#94a3b8]">
                                ({diasTranscurridos} d transcurridos)
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] text-cyan-400 font-medium block mt-0.5">
                        {legalEntityBadge}
                    </span>
                </div>
            </div>

            {/* Box 3: Responsable de Pago (Ley Colombiana) */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center gap-3.5">
                <div className="p-3 rounded-xl shrink-0 bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {responsibleIcon}
                </div>
                <div className="overflow-hidden">
                    <span className="text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold block">
                        Responsable Legal del Pago
                    </span>
                    <span className="text-sm font-bold text-white block truncate mt-0.5">
                        {legalResponsible}
                    </span>
                    <span className="text-[11px] text-[#94a3b8] block mt-0.5 truncate">
                        Reconocimiento: <strong className="text-white">{legalPercentage}</strong>
                    </span>
                </div>
            </div>

            {/* Alertas dinámicas si existen */}
            {alertas.length > 0 && (
                <div className="md:col-span-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                        <span className="font-semibold">Alertas de Vencimiento de Plazos:</span>
                        <ul className="list-disc list-inside mt-0.5 text-amber-200/90 space-y-0.5">
                            {alertas.map((alerta, i) => (
                                <li key={i}>{alerta}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default IncapacidadStatusSemaphore

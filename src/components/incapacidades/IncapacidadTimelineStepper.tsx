'use client'

import React from 'react'
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react'

interface TimelineStepperProps {
    currentStatus: string
}

interface StepDefinition {
    id: number
    key: string
    title: string
    subtitle: string
    includedStatuses: string[]
}

const STEPS: StepDefinition[] = [
    {
        id: 1,
        key: 'recibida',
        title: 'Radicación',
        subtitle: 'Recibida en sistema',
        includedStatuses: ['Recibida'],
    },
    {
        id: 2,
        key: 'validacion',
        title: 'Validación Doc.',
        subtitle: 'Revisión SG-SST / RH',
        includedStatuses: ['En validación documental', 'Documentación incompleta'],
    },
    {
        id: 3,
        key: 'transcripcion',
        title: 'Transcripción',
        subtitle: 'Trámite ante EPS/ARL',
        includedStatuses: ['Pendiente transcripción', 'Transcrita'],
    },
    {
        id: 4,
        key: 'aprobacion',
        title: 'Aprobación EPS',
        subtitle: 'Reconocimiento médico',
        includedStatuses: ['En verificación EPS', 'Aprobada', 'Aprovada'],
    },
    {
        id: 5,
        key: 'pago',
        title: 'Liquidación & Pago',
        subtitle: 'Recobro económico',
        includedStatuses: ['Pendiente pago', 'Pagada', 'Cobrada'],
    },
    {
        id: 6,
        key: 'cierre',
        title: 'Conciliación',
        subtitle: 'Contabilidad y archivo',
        includedStatuses: ['En conciliación', 'Conciliada', 'Cerrada', 'Archivada'],
    },
]

export function IncapacidadTimelineStepper({ currentStatus }: TimelineStepperProps) {
    const isRechazada = currentStatus.toLowerCase().includes('rechazad')
    const isIncompleta = currentStatus.toLowerCase().includes('incomplet')
    const isCobroEspecial = currentStatus.toLowerCase().includes('cobro')

    // Find current active step index (0 to 5)
    let activeStepIndex = 0
    STEPS.forEach((step, idx) => {
        if (
            step.includedStatuses.some(
                (s) => s.toLowerCase() === currentStatus.toLowerCase()
            )
        ) {
            activeStepIndex = idx
        }
    })

    return (
        <div className="rounded-2xl bg-[#111827] border border-[#334155] p-5 sm:p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#334155]/60">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        Línea de Tiempo del Trámite Médico
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#94a3b8]">Estado Actual:</span>
                    <span className={`font-semibold px-2.5 py-0.5 rounded-full border text-[11px] ${
                        isRechazada
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : isIncompleta || isCobroEspecial
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                        {currentStatus}
                    </span>
                </div>
            </div>

            {/* Steps Container */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative">
                {STEPS.map((step, index) => {
                    const isCompleted = index < activeStepIndex && !isRechazada
                    const isCurrent = index === activeStepIndex

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col p-3 rounded-xl border transition-all ${
                                isCurrent
                                    ? isRechazada
                                        ? 'bg-red-500/10 border-red-500/40 ring-1 ring-red-500/30'
                                        : isIncompleta
                                        ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                                        : 'bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/5'
                                    : isCompleted
                                    ? 'bg-[#0f172a] border-emerald-500/30'
                                    : 'bg-[#0f172a]/60 border-[#334155]/60 opacity-60'
                            }`}
                        >
                            {/* Step Badge & Icon */}
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isCurrent
                                        ? 'bg-blue-600 text-white'
                                        : isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-[#1e293b] text-[#94a3b8]'
                                }`}>
                                    Paso {step.id}
                                </span>

                                {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                ) : isCurrent ? (
                                    isRechazada ? (
                                        <XCircle className="h-4 w-4 text-red-400 animate-pulse" />
                                    ) : isIncompleta ? (
                                        <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-blue-400 animate-spin" />
                                    )
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-[#334155]" />
                                )}
                            </div>

                            {/* Titles */}
                            <span className={`text-xs font-semibold block leading-tight ${
                                isCurrent ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-[#94a3b8]'
                            }`}>
                                {step.title}
                            </span>
                            <span className="text-[10px] text-[#94a3b8] mt-1 line-clamp-1 block">
                                {step.subtitle}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default IncapacidadTimelineStepper

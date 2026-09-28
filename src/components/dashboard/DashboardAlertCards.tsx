'use client'

import React from 'react'
import Link from 'next/link'
import {
    FileWarning,
    CalendarClock,
    ClockAlert,
    Scale,
    ChevronRight,
    AlertCircle,
} from 'lucide-react'

interface DashboardAlertCardsProps {
    documentosFaltantes: number
    casosMasDe90Dias: number
    pagosRetrasados: number
    casosJuridicos: number
    isLoading?: boolean
}

export function DashboardAlertCards({
    documentosFaltantes,
    casosMasDe90Dias,
    pagosRetrasados,
    casosJuridicos,
    isLoading = false,
}: DashboardAlertCardsProps) {
    const alerts = [
        {
            id: 'docs',
            title: 'Documentos Faltantes',
            count: documentosFaltantes,
            description: 'Incapacidades con checklist incompleto o sin soporte médico validado.',
            icon: FileWarning,
            href: '/documentos',
            actionText: 'Revisar expedientes',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        },
        {
            id: 'long',
            title: 'Casos > 90 Días',
            count: casosMasDe90Dias,
            description: 'Incapacidades de alta severidad que requieren concepto de rehabilitación.',
            icon: CalendarClock,
            href: '/incapacidades',
            actionText: 'Ver casos críticos',
            color: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        },
        {
            id: 'pagos',
            title: 'Pagos Retrasados / Mora',
            count: pagosRetrasados,
            description: 'Prestaciones económicas con plazo legal de pago vencido ante la EPS.',
            icon: ClockAlert,
            href: '/cobros/seguimientos',
            actionText: 'Gestionar cobros',
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
        },
        {
            id: 'juridico',
            title: 'Cobro Jurídico',
            count: casosJuridicos,
            description: 'Casos escalados formalmente a asesoría legal o requerimiento SuperSalud.',
            icon: Scale,
            href: '/cobros/juridico',
            actionText: 'Ir a jurídico',
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
        },
    ]

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-white">
                        Alertas y Casos de Atención Inmediata
                    </h3>
                </div>
                <span className="text-[11px] text-[#94a3b8]">
                    Monitoreo legal y de riesgos
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {alerts.map((alert) => {
                    const Icon = alert.icon

                    return (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-2xl bg-[#111827] border ${alert.border} shadow-lg shadow-black/20 hover:border-slate-500 transition flex flex-col justify-between space-y-3 group`}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-xl ${alert.bg} ${alert.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    {isLoading ? (
                                        <div className="h-5 w-8 bg-[#1e293b] animate-pulse rounded" />
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${alert.badgeBg}`}>
                                            {alert.count}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition">
                                        {alert.title}
                                    </h4>
                                    <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed line-clamp-2">
                                        {alert.description}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={alert.href}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#cbd5e1] group-hover:text-white transition pt-2 border-t border-[#334155]/50"
                            >
                                <span>{alert.actionText}</span>
                                <ChevronRight className="h-3 w-3 text-[#94a3b8] group-hover:translate-x-0.5 transition" />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

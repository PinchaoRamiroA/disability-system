import React from 'react'
import Link from 'next/link'
import {
    Activity,
    Clock,
    DollarSign,
    Users,
    FileText,
    FileCheck,
    Send,
    PlusCircle,
    ChevronRight,
    TrendingUp,
} from 'lucide-react'

export const metadata = {
    title: 'Dashboard Operativo',
}

export default function DashboardPage() {
    const kpis = [
        {
            title: 'Incapacidades Activas',
            value: '148',
            change: '+12%',
            trend: 'up',
            detail: '42 radicadas esta semana',
            icon: Activity,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
        },
        {
            title: 'Pendientes Radicación EPS',
            value: '23',
            change: '-4',
            trend: 'down',
            detail: '5 próximas a vencer término',
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
        },
        {
            title: 'Cartera en Recobro',
            value: '$ 48.2M',
            change: '+8.4%',
            trend: 'up',
            detail: '91% tasa de recuperación',
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
        },
        {
            title: 'Colaboradores Registrados',
            value: '1,280',
            change: '+15',
            trend: 'up',
            detail: 'En 12 sedes operativas',
            icon: Users,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Dashboard Operativo
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Monitoreo en tiempo real de incapacidades, radicaciones ante EPS/ARL y recaudos.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/incapacidades/crear"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Radicar Incapacidad</span>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon
                    return (
                        <div
                            key={kpi.title}
                            className={`p-5 rounded-xl bg-[#111827] border ${kpi.border} shadow-sm hover:border-[#475569] transition flex flex-col justify-between`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-[#94a3b8]">
                                        {kpi.title}
                                    </span>
                                    <div className="text-2xl font-bold text-white tracking-tight">
                                        {kpi.value}
                                    </div>
                                </div>
                                <div className={`p-2.5 rounded-lg ${kpi.bg}`}>
                                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-[11px]">
                                <span className="text-[#94a3b8]">{kpi.detail}</span>
                                <span
                                    className={`font-semibold flex items-center gap-0.5 ${
                                        kpi.trend === 'up' ? 'text-emerald-400' : 'text-amber-400'
                                    }`}
                                >
                                    <TrendingUp className="h-3 w-3" />
                                    {kpi.change}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Incapacidades Module Card */}
                <div className="p-6 rounded-xl bg-[#111827] border border-[#334155] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">
                                    Gestión de Incapacidades
                                </h3>
                                <p className="text-[11px] text-[#94a3b8]">Módulo Central (Prioridad 2)</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            Core
                        </span>
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                        Control de prórrogas, estados, contingencias (Enfermedad General, Accidente de Trabajo, Maternidad) y plazos legales.
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                        <Link
                            href="/incapacidades"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                        >
                            <span>Ir al listado de incapacidades</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Documentos Module Card */}
                <div className="p-6 rounded-xl bg-[#111827] border border-[#334155] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">
                                    Expediente Documental
                                </h3>
                                <p className="text-[11px] text-[#94a3b8]">Recepción y Checklist (Prioridad 3)</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Digital
                        </span>
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                        Validación de certificados médicos, historias clínicas, epicrisis y FURIPS con checklist por tipo de evento.
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                        <Link
                            href="/documentos"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                        >
                            <span>Validar documentos pendientes</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Transcripciones Module Card */}
                <div className="p-6 rounded-xl bg-[#111827] border border-[#334155] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Send className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">
                                    Transcripción EPS / ARL
                                </h3>
                                <p className="text-[11px] text-[#94a3b8]">Radicación y Términos (Prioridad 4)</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Vencimientos
                        </span>
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                        Semáforo de plazos legales para radicar ante SURA, Sanitas, Nueva EPS, SOS y Positiva dentro de los términos.
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                        <Link
                            href="/transcripciones"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                        >
                            <span>Gestionar radicaciones</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

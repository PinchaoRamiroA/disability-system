'use client'

import React, { use, useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    Download,
    ExternalLink,
    FileCheck2,
    FileText,
    History,
    Info,
    Landmark,
    MessageSquare,
    PhoneCall,
    Receipt,
    Shield,
    ShieldAlert,
    User,
    Users,
} from 'lucide-react'
import type {
    Incapacidad,
    PlazosInfo,
    HistorialEvento,
    IncapacidadDocumento,
} from '@/contracts/incapacidades'
import type { Pago, Seguimiento } from '@/contracts/cobros'
import {
    getIncapacidadById,
    getIncapacidadPlazos,
    getIncapacidadDocumentos,
    getIncapacidadHistorial,
    getIncapacidadPagos,
    getIncapacidadSeguimientos,
} from '@/services/incapacidad.service'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { IncapacidadTimelineStepper } from '@/components/incapacidades/IncapacidadTimelineStepper'
import { IncapacidadStatusSemaphore } from '@/components/incapacidades/IncapacidadStatusSemaphore'

interface PageProps {
    params: Promise<{ id: string }>
}

type TabKey = 'general' | 'documentos' | 'historial' | 'seguimientos' | 'pagos'

export default function IncapacidadDetailPage({ params }: PageProps) {
    const { id } = use(params)

    const [incapacidad, setIncapacidad] = useState<Incapacidad | null>(null)
    const [plazos, setPlazos] = useState<PlazosInfo | null>(null)
    const [documentos, setDocumentos] = useState<IncapacidadDocumento[]>([])
    const [historial, setHistorial] = useState<HistorialEvento[]>([])
    const [pagos, setPagos] = useState<Pago[]>([])
    const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([])

    const [activeTab, setActiveTab] = useState<TabKey>('general')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        async function loadAllData() {
            setIsLoading(true)
            setError(null)
            try {
                // Fetch primary entity
                const data = await getIncapacidadById(id)
                if (!isMounted) return
                setIncapacidad(data)

                // Fetch secondary relational tabs in parallel
                const [plazosData, docsData, histData, pagosData, segData] = await Promise.all([
                    getIncapacidadPlazos(id),
                    getIncapacidadDocumentos(id),
                    getIncapacidadHistorial(id),
                    getIncapacidadPagos(id),
                    getIncapacidadSeguimientos(id),
                ])

                if (isMounted) {
                    setPlazos(plazosData)
                    setDocumentos(docsData)
                    setHistorial(histData)
                    setPagos(pagosData)
                    setSeguimientos(segData)
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setError(err.message)
                    } else {
                        setError('No se pudo cargar la información de la incapacidad.')
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadAllData()
        return () => {
            isMounted = false
        }
    }, [id])

    // Calculate total calendar days
    const totalDays = useMemo(() => {
        if (!incapacidad?.fecha_inicio || !incapacidad?.fecha_fin) return 0
        const start = new Date(incapacidad.fecha_inicio)
        const end = new Date(incapacidad.fecha_fin)
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
        const diff = end.getTime() - start.getTime()
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
    }, [incapacidad?.fecha_inicio, incapacidad?.fecha_fin])

    // Total amount calculated from payments
    const totalPagado = useMemo(() => {
        return pagos.reduce((acc, p) => {
            const val = parseFloat(p.valor || '0')
            return acc + (isNaN(val) ? 0 : val)
        }, 0)
    }, [pagos])

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                <div className="flex items-center gap-3.5">
                    <Link
                        href="/incapacidades"
                        className="p-2.5 rounded-xl bg-[#111827] hover:bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:text-white transition shadow-sm"
                        title="Volver a la bandeja de incapacidades"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Incapacidad #{id}
                            </h1>
                            {incapacidad?.estado && (
                                <StatusBadge status={incapacidad.estado.nombre} />
                            )}
                            {incapacidad?.entidad && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {incapacidad.entidad.nombre} ({incapacidad.entidad.tipo})
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 font-medium">
                            {incapacidad?.titulo || 'Cargando expediente médico...'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/incapacidades/crear"
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                    >
                        Nueva Incapacidad
                    </Link>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-red-500/30 text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
                    <p className="text-sm text-white font-medium">{error}</p>
                    <Link
                        href="/incapacidades"
                        className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                    >
                        Volver a Incapacidades
                    </Link>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                        ))}
                    </div>
                    <div className="h-28 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                    <div className="h-96 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                </div>
            )}

            {!isLoading && !error && incapacidad && (
                <>
                    {/* Status Semaphore & Legal Indicators (Task 2.3.3) */}
                    <IncapacidadStatusSemaphore
                        statusName={incapacidad.estado?.nombre || 'Recibida'}
                        diasTranscurridos={plazos?.dias_transcurridos ?? 0}
                        diasTotales={totalDays}
                        origen={incapacidad.origen}
                        alertas={plazos?.alertas_vencimiento || []}
                    />

                    {/* Timeline Stepper for States (Task 2.3.6) */}
                    <IncapacidadTimelineStepper
                        currentStatus={incapacidad.estado?.nombre || 'Recibida'}
                    />

                    {/* Tabs Navigation (Task 2.3.2) */}
                    <div className="border-b border-[#334155]">
                        <div className="flex gap-2 overflow-x-auto pb-px">
                            <button
                                type="button"
                                onClick={() => setActiveTab('general')}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'general'
                                        ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                                        : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                                }`}
                            >
                                <Info className="h-4 w-4" />
                                <span>Información General</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('documentos')}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'documentos'
                                        ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                                        : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                                }`}
                            >
                                <FileText className="h-4 w-4" />
                                <span>Documentos</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1e293b] text-[#cbd5e1]">
                                    {documentos.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('historial')}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'historial'
                                        ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                                        : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                                }`}
                            >
                                <History className="h-4 w-4" />
                                <span>Historial & Bitácora</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1e293b] text-[#cbd5e1]">
                                    {historial.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('seguimientos')}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'seguimientos'
                                        ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                                        : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                                }`}
                            >
                                <PhoneCall className="h-4 w-4" />
                                <span>Seguimientos de Cobro</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1e293b] text-[#cbd5e1]">
                                    {seguimientos.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('pagos')}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'pagos'
                                        ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                                        : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                                }`}
                            >
                                <CreditCard className="h-4 w-4" />
                                <span>Pagos & Conciliación</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1e293b] text-[#cbd5e1]">
                                    {pagos.length}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Tab 1: Información General (Task 2.3.5) */}
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: General Medical Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Diagnóstico y Contingencia */}
                                <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4">
                                    <div className="flex items-center gap-2 text-white font-semibold text-sm pb-3 border-b border-[#334155]/60">
                                        <FileCheck2 className="h-4 w-4 text-blue-400" />
                                        <span>Diagnóstico y Contingencia Médica</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-[#94a3b8] block">Título o Diagnóstico</span>
                                            <span className="text-white font-semibold text-sm block mt-0.5">
                                                {incapacidad.titulo}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#94a3b8] block">Tipo de Incapacidad</span>
                                            <span className="text-white font-medium block mt-0.5">
                                                {incapacidad.tipo?.nombre || 'General'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#94a3b8] block">Origen de la Contingencia</span>
                                            <span className="text-white font-medium capitalize block mt-0.5">
                                                {incapacidad.origen?.replace(/_/g, ' ') || 'Enfermedad General'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#94a3b8] block">Canal de Recepción</span>
                                            <span className="text-white font-medium capitalize block mt-0.5">
                                                {incapacidad.canal_recepcion || 'Portal Web'}
                                            </span>
                                        </div>
                                    </div>

                                    {incapacidad.observaciones && (
                                        <div className="pt-3 border-t border-[#334155]">
                                            <span className="text-[#94a3b8] block text-xs mb-1.5 font-medium">
                                                Observaciones Clínicas / Administrativas
                                            </span>
                                            <p className="text-xs text-[#cbd5e1] bg-[#0f172a] p-3.5 rounded-xl border border-[#334155] leading-relaxed">
                                                {incapacidad.observaciones}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Fechas y Periodo */}
                                <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4">
                                    <div className="flex items-center gap-2 text-white font-semibold text-sm pb-3 border-b border-[#334155]/60">
                                        <Calendar className="h-4 w-4 text-cyan-400" />
                                        <span>Periodo y Fechas Clave</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                        <div>
                                            <span className="text-[#94a3b8] block">Fecha de Inicio</span>
                                            <span className="text-white font-semibold block mt-0.5">
                                                {incapacidad.fecha_inicio}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#94a3b8] block">Fecha de Fin</span>
                                            <span className="text-white font-semibold block mt-0.5">
                                                {incapacidad.fecha_fin}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#94a3b8] block">Días Totales</span>
                                            <span className="text-blue-400 font-bold block mt-0.5">
                                                {totalDays} días calendario
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[#94a3b8] block">Fecha Radicación</span>
                                            <span className="text-white font-medium block mt-0.5">
                                                {incapacidad.fecha_radicacion || 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Entidad & Titular */}
                            <div className="space-y-6">
                                {/* Entidad Aseguradora */}
                                <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4">
                                    <div className="flex items-center gap-2 text-white font-semibold text-sm pb-3 border-b border-[#334155]/60">
                                        <Building2 className="h-4 w-4 text-emerald-400" />
                                        <span>Entidad de Salud</span>
                                    </div>
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <span className="text-[#94a3b8] block">Nombre de la Entidad</span>
                                            <span className="text-white font-semibold text-sm block mt-0.5">
                                                {incapacidad.entidad?.nombre}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#94a3b8]">Tipo de Entidad</span>
                                            <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                {incapacidad.entidad?.tipo}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#94a3b8]">Plazo de Transcripción</span>
                                            <span className="text-white font-medium">
                                                {incapacidad.entidad?.plazo_transcripcion_dias || 8} días
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#94a3b8]">Tiempo Máx. de Pago</span>
                                            <span className="text-white font-medium">
                                                {incapacidad.entidad?.tiempo_maximo_pago_dias || 30} días
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Plazos Legales y Vencimientos */}
                                {plazos && (
                                    <div className="p-6 rounded-2xl bg-[#111827] border border-[#334155] space-y-4">
                                        <div className="flex items-center gap-2 text-white font-semibold text-sm pb-3 border-b border-[#334155]/60">
                                            <Clock className="h-4 w-4 text-purple-400" />
                                            <span>Plazos y Vencimientos Legales</span>
                                        </div>
                                        <div className="space-y-3 text-xs">
                                            {plazos.fecha_limite_entrega && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#94a3b8]">Límite Entrega Docs</span>
                                                    <span className="text-white font-semibold">
                                                        {plazos.fecha_limite_entrega}
                                                    </span>
                                                </div>
                                            )}
                                            {plazos.fecha_limite_transcripcion && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#94a3b8]">Límite Transcripción</span>
                                                    <span className="text-white font-semibold">
                                                        {plazos.fecha_limite_transcripcion}
                                                    </span>
                                                </div>
                                            )}
                                            {plazos.fecha_limite_pago && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#94a3b8]">Límite Pago EPS</span>
                                                    <span className="text-white font-semibold">
                                                        {plazos.fecha_limite_pago}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Documentos */}
                    {activeTab === 'documentos' && (
                        <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]/60">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Expediente Documental Adjunto
                                    </h2>
                                    <p className="text-xs text-[#94a3b8]">
                                        Documentos y soportes requeridos para el reconocimiento y transcripción
                                    </p>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                    {documentos.length} documento{documentos.length !== 1 ? 's' : ''} registrado{documentos.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {documentos.length === 0 ? (
                                <div className="p-12 text-center rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
                                    <FileText className="h-10 w-10 text-[#64748b] mx-auto" />
                                    <p className="text-sm text-white font-medium">
                                        No hay documentos cargados en esta incapacidad.
                                    </p>
                                    <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
                                        Los documentos requeridos incluyen el certificado médico original, historia clínica o epicrisis según el origen de la contingencia.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-[11px] border-b border-[#334155]">
                                            <tr>
                                                <th className="py-3 px-4">Documento / Archivo</th>
                                                <th className="py-3 px-4">Tipo de Soporte</th>
                                                <th className="py-3 px-4">Estado</th>
                                                <th className="py-3 px-4">Fecha de Carga</th>
                                                <th className="py-3 px-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#334155]/50">
                                            {documentos.map((doc) => (
                                                <tr key={doc.id_documento} className="hover:bg-[#1e293b]/40 transition">
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                                                            <div>
                                                                <span className="font-semibold text-white block">
                                                                    {doc.nombre}
                                                                </span>
                                                                <span className="text-[10px] text-[#94a3b8] uppercase">
                                                                    Formato: {doc.formato || 'PDF'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-[#cbd5e1] font-medium capitalize">
                                                        {doc.tipo?.replace(/_/g, ' ')}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                                                            doc.estado === 'Validado'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : doc.estado === 'Rechazado'
                                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                            {doc.estado || 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-[#94a3b8]">
                                                        {doc.fecha_carga || doc.created_at || 'Reciente'}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        {doc.url && (
                                                            <a
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-blue-600 text-[#cbd5e1] hover:text-white border border-[#334155] transition text-xs font-medium"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                <span>Descargar</span>
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Historial & Bitácora */}
                    {activeTab === 'historial' && (
                        <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Bitácora Cronológica de Eventos
                                    </h2>
                                    <p className="text-xs text-[#94a3b8]">
                                        Trazabilidad completa de cambios de estado y acciones ejecutadas
                                    </p>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {historial.length} eventos
                                </span>
                            </div>

                            {historial.length === 0 ? (
                                <div className="p-12 text-center rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                    <History className="h-10 w-10 text-[#64748b] mx-auto" />
                                    <p className="text-sm text-white font-medium">
                                        No hay eventos registrados en la bitácora aún.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#334155]">
                                    {historial.map((item) => (
                                        <div key={item.id_historial} className="relative p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                                            <div className="absolute -left-6 top-4 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-[#111827]" />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                                                <span className="font-semibold text-white">
                                                    {item.descripcion}
                                                </span>
                                                <span className="text-[11px] text-[#94a3b8]">
                                                    {item.fecha}
                                                </span>
                                            </div>
                                            {item.gestor_id && (
                                                <span className="text-[11px] text-cyan-400 block">
                                                    Gestor Responsable ID: #{item.gestor_id}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 4: Seguimientos */}
                    {activeTab === 'seguimientos' && (
                        <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Seguimientos y Acciones de Cobro
                                    </h2>
                                    <p className="text-xs text-[#94a3b8]">
                                        Registro de contactos y gestiones de cobranza persuasiva o jurídica
                                    </p>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    {seguimientos.length} seguimiento{seguimientos.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {seguimientos.length === 0 ? (
                                <div className="p-12 text-center rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                    <PhoneCall className="h-10 w-10 text-[#64748b] mx-auto" />
                                    <p className="text-sm text-white font-medium">
                                        No hay seguimientos registrados para esta incapacidad.
                                    </p>
                                    <p className="text-xs text-[#94a3b8]">
                                        Los seguimientos permiten documentar llamadas a EPS/ARL, radicados de peticiones y gestiones persuasivas.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {seguimientos.map((seg) => (
                                        <div key={seg.id_seguimiento} className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2 text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-purple-400 uppercase tracking-wider text-[10px]">
                                                    {seg.tipo_seguimiento}
                                                </span>
                                                <span className="text-[#94a3b8] text-[11px]">
                                                    {seg.fecha_contacto || seg.created_at}
                                                </span>
                                            </div>
                                            <p className="text-[#cbd5e1] leading-relaxed">
                                                {seg.descripcion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 5: Pagos & Conciliación */}
                    {activeTab === 'pagos' && (
                        <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]/60">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Desglose de Pagos y Recobros EPS/ARL
                                    </h2>
                                    <p className="text-xs text-[#94a3b8]">
                                        Registro de transferencias, consignaciones y estado de conciliación contable
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="text-[10px] text-[#94a3b8] uppercase block">Total Reconocido</span>
                                        <span className="text-sm font-bold text-emerald-400">
                                            ${totalPagado.toLocaleString('es-CO')} COP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {pagos.length === 0 ? (
                                <div className="p-12 text-center rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                    <Receipt className="h-10 w-10 text-[#64748b] mx-auto" />
                                    <p className="text-sm text-white font-medium">
                                        No hay pagos registrados para esta incapacidad.
                                    </p>
                                    <p className="text-xs text-[#94a3b8]">
                                        Una vez la EPS o ARL efectúe el pago de la prestación económica, se visualizará en este módulo.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-[11px] border-b border-[#334155]">
                                            <tr>
                                                <th className="py-3 px-4">Valor Reconocido</th>
                                                <th className="py-3 px-4">Tipo de Pago</th>
                                                <th className="py-3 px-4">Estado del Pago</th>
                                                <th className="py-3 px-4">Fecha de Pago</th>
                                                <th className="py-3 px-4">Periodo Contable</th>
                                                <th className="py-3 px-4 text-right">Conciliación</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#334155]/50">
                                            {pagos.map((pago) => (
                                                <tr key={pago.id_pago} className="hover:bg-[#1e293b]/40 transition">
                                                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                                                        ${parseFloat(pago.valor || '0').toLocaleString('es-CO')}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-white font-medium capitalize">
                                                        {pago.tipo_pago?.replace(/_/g, ' ')}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            {pago.estado_pago}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-[#94a3b8]">
                                                        {pago.fecha_pago}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-[#cbd5e1]">
                                                        {pago.periodo_contable || 'N/A'}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                                                            pago.conciliado
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                            {pago.conciliado ? 'Conciliado' : 'Pendiente Conciliación'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

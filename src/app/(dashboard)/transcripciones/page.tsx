'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
    Search,
    RefreshCw,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Building2,
    FileCheck2,
    ChevronRight,
    Play,
    Calendar,
    Flame,
    Eye,
    Send,
    ShieldAlert,
    ExternalLink,
    Filter,
} from 'lucide-react'
import { TranscripcionPendienteItem } from '@/contracts/incapacidades'
import {
    getTranscripcionesPendientes,
    marcarTranscripcionEnProceso,
} from '@/services/transcripcion.service'
import { ModalTranscribir } from '@/components/transcripciones/ModalTranscribir'
import { ModalDetallePlazos } from '@/components/transcripciones/ModalDetallePlazos'

type FilterEstado = 'todos' | 'pendiente' | 'en_proceso' | 'por_vencer' | 'vencida'

export default function TranscripcionesPage() {
    const [items, setItems] = useState<TranscripcionPendienteItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filtroEstado, setFiltroEstado] = useState<FilterEstado>('todos')
    const [selectedItemForTranscribir, setSelectedItemForTranscribir] =
        useState<TranscripcionPendienteItem | null>(null)
    const [selectedPlazosItem, setSelectedPlazosItem] = useState<{
        id: number
        titulo?: string
        entidadNombre?: string
    } | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [updatingId, setUpdatingId] = useState<number | null>(null)
    const [toastMessage, setToastMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const showToast = (text: string, type: 'success' | 'error' = 'success') => {
        setToastMessage({ text, type })
        setTimeout(() => setToastMessage(null), 4000)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await getTranscripcionesPendientes({ limit: 100 })
            setItems(res.items || [])
        } catch (err) {
            console.error('Error fetching transcripciones:', err)
            showToast('Error al consultar trámites de transcripción.', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let isMounted = true
        getTranscripcionesPendientes({ limit: 100 })
            .then((res) => {
                if (isMounted) {
                    setItems(res.items || [])
                }
            })
            .catch((err) => {
                console.error('Error fetching transcripciones:', err)
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [])

    // Calcular métricas
    const metrics = useMemo(() => {
        let total = 0
        let enProceso = 0
        let porVencer = 0
        let vencidas = 0

        items.forEach((item) => {
            total++
            if (item.estado_transcripcion === 'en_proceso') {
                enProceso++
            }
            const dr = item.dias_restantes
            if (dr !== null && dr !== undefined) {
                if (dr <= 0 || item.estado_transcripcion === 'vencida') {
                    vencidas++
                } else if (dr <= 3) {
                    porVencer++
                }
            }
        })

        return { total, enProceso, porVencer, vencidas }
    }, [items])

    // Filtrar elementos
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Filtro por texto
            const term = searchTerm.toLowerCase().trim()
            const matchSearch =
                !term ||
                item.titulo.toLowerCase().includes(term) ||
                `INC-${item.id_incapacidad}`.toLowerCase().includes(term) ||
                item.entidad?.nombre.toLowerCase().includes(term) ||
                item.tipo?.nombre.toLowerCase().includes(term) ||
                (item.id_usuario && item.id_usuario.toString().includes(term))

            if (!matchSearch) return false

            // Filtro por estado / semáforo
            if (filtroEstado === 'todos') return true
            if (filtroEstado === 'pendiente')
                return item.estado_transcripcion === 'pendiente'
            if (filtroEstado === 'en_proceso')
                return item.estado_transcripcion === 'en_proceso'
            if (filtroEstado === 'por_vencer') {
                const dr = item.dias_restantes
                return (
                    dr !== null &&
                    dr !== undefined &&
                    dr > 0 &&
                    dr <= 3 &&
                    item.estado_transcripcion !== 'completado'
                )
            }
            if (filtroEstado === 'vencida') {
                const dr = item.dias_restantes
                return (
                    (dr !== null && dr !== undefined && dr <= 0) ||
                    item.estado_transcripcion === 'vencida'
                )
            }

            return true
        })
    }, [items, searchTerm, filtroEstado])

    const handleMarcarEnProceso = async (id: number) => {
        try {
            setUpdatingId(id)
            await marcarTranscripcionEnProceso(id)
            setItems((prev) =>
                prev.map((i) =>
                    i.id_incapacidad === id
                        ? { ...i, estado_transcripcion: 'en_proceso' }
                        : i
                )
            )
            showToast('Trámite marcado como "En Proceso" exitosamente.')
        } catch {
            showToast('Error al actualizar el estado a en proceso.', 'error')
        } finally {
            setUpdatingId(null)
        }
    }

    const openTranscribirModal = (item: TranscripcionPendienteItem) => {
        setSelectedItemForTranscribir(item)
        setIsModalOpen(true)
    }

    const renderSemaforoBadge = (item: TranscripcionPendienteItem) => {
        const dr = item.dias_restantes

        if (item.estado_transcripcion === 'completado') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Transcrita</span>
                </span>
            )
        }

        if (dr === null || dr === undefined) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                    <Clock className="h-3 w-3" />
                    <span>Sin plazo</span>
                </span>
            )
        }

        // Semáforo Rojo: Vencida / Extemporánea
        if (dr <= 0 || item.estado_transcripcion === 'vencida') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{dr === 0 ? 'Vence hoy' : `Vencida (${Math.abs(dr)}d)`}</span>
                </span>
            )
        }

        // Semáforo Amarillo: 1 a 5 días restantes
        if (dr <= 5) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{dr === 1 ? '1 día restante' : `${dr} días restantes`}</span>
                </span>
            )
        }

        // Semáforo Verde: > 5 días restantes
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{dr} días restantes</span>
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* Toast notification */}
            {toastMessage && (
                <div
                    className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom duration-200 ${
                        toastMessage.type === 'success'
                            ? 'bg-[#064e3b] border-emerald-500/40 text-emerald-200'
                            : 'bg-[#7f1d1d] border-red-500/40 text-red-200'
                    }`}
                >
                    {toastMessage.type === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <span>{toastMessage.text}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <Send className="h-6 w-6 text-blue-400" />
                        <span>Transcripción ante EPS / ARL</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                        Control de radicación, plazos perentorios legales y semáforo de vencimientos por entidad.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#cbd5e1] bg-[#1f2937] hover:bg-[#374151] border border-[#334155] transition disabled:opacity-50"
                        title="Actualizar registros"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Actualizar</span>
                    </button>
                    <Link
                        href="/incapacidades"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 transition"
                    >
                        <span>Todas las incapacidades</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>

            {/* Banner de Alertas de Vencimiento Próximo (Task 4.2.2) */}
            {(metrics.porVencer > 0 || metrics.vencidas > 0) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-[#111827] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <Flame className="h-5 w-5 animate-bounce" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                                <span>Alertas de Vencimiento Próximo ante EPS / ARL</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    {metrics.porVencer + metrics.vencidas} casos prioritarios
                                </span>
                            </h3>
                            <p className="text-[11px] sm:text-xs text-[#cbd5e1] mt-0.5">
                                Hay <strong className="text-amber-400">{metrics.porVencer} incapacidades</strong> con término perentorio ≤ 3 días hábiles y <strong className="text-rose-400">{metrics.vencidas} extemporáneas</strong>. Radique a tiempo para garantizar el reconocimiento del subsidio económico.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {metrics.porVencer > 0 && (
                            <button
                                onClick={() => setFiltroEstado('por_vencer')}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition"
                            >
                                Filtrar por vencer ({metrics.porVencer})
                            </button>
                        )}
                        {metrics.vencidas > 0 && (
                            <button
                                onClick={() => setFiltroEstado('vencida')}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 transition"
                            >
                                Filtrar vencidas ({metrics.vencidas})
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Cards de Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => setFiltroEstado('todos')}
                    className={`p-4 rounded-xl border text-left transition ${
                        filtroEstado === 'todos'
                            ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/40'
                            : 'bg-[#111827] border-[#334155] hover:border-[#475569]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-medium">Total en Trámite</span>
                        <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <FileCheck2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                        {loading ? '...' : metrics.total}
                    </div>
                    <span className="text-[11px] text-[#64748b] mt-0.5 block">
                        Pendientes o en radicación
                    </span>
                </button>

                <button
                    onClick={() => setFiltroEstado('en_proceso')}
                    className={`p-4 rounded-xl border text-left transition ${
                        filtroEstado === 'en_proceso'
                            ? 'bg-amber-600/10 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/40'
                            : 'bg-[#111827] border-[#334155] hover:border-[#475569]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-medium">En Proceso</span>
                        <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400 mt-2">
                        {loading ? '...' : metrics.enProceso}
                    </div>
                    <span className="text-[11px] text-[#64748b] mt-0.5 block">
                        Gestionando radicado
                    </span>
                </button>

                <button
                    onClick={() => setFiltroEstado('por_vencer')}
                    className={`p-4 rounded-xl border text-left transition ${
                        filtroEstado === 'por_vencer'
                            ? 'bg-orange-600/10 border-orange-500/50 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/40'
                            : 'bg-[#111827] border-[#334155] hover:border-[#475569]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-medium">Por Vencer</span>
                        <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <Flame className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-400 mt-2">
                        {loading ? '...' : metrics.porVencer}
                    </div>
                    <span className="text-[11px] text-[#64748b] mt-0.5 block">
                        Restan ≤ 3 días hábiles
                    </span>
                </button>

                <button
                    onClick={() => setFiltroEstado('vencida')}
                    className={`p-4 rounded-xl border text-left transition ${
                        filtroEstado === 'vencida'
                            ? 'bg-rose-600/10 border-rose-500/50 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/40'
                            : 'bg-[#111827] border-[#334155] hover:border-[#475569]'
                    }`}
                >
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-medium">Vencidas</span>
                        <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                            <ShieldAlert className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-rose-400 mt-2">
                        {loading ? '...' : metrics.vencidas}
                    </div>
                    <span className="text-[11px] text-[#64748b] mt-0.5 block">
                        Fuera de término legal
                    </span>
                </button>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por expediente (INC-0001), entidad (Sura, Sanitas) o título..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0b0f19] border border-[#334155] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] mr-1 shrink-0">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filtro:</span>
                    </div>

                    {[
                        { id: 'todos', label: 'Todos' },
                        { id: 'pendiente', label: 'Pendientes' },
                        { id: 'en_proceso', label: 'En Proceso' },
                        { id: 'por_vencer', label: 'Por Vencer (≤3d)' },
                        { id: 'vencida', label: 'Vencidas' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFiltroEstado(tab.id as FilterEstado)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                                filtroEstado === tab.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                    : 'bg-[#1f2937] text-[#94a3b8] hover:text-white hover:bg-[#374151]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla con Semáforo */}
            <div className="rounded-xl bg-[#111827] border border-[#334155] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#334155] bg-[#0f172a]/70 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                                <th className="py-3 px-4">Expediente</th>
                                <th className="py-3 px-4">Entidad Receptora</th>
                                <th className="py-3 px-4">Tipo Incapacidad</th>
                                <th className="py-3 px-4">Periodo Médico</th>
                                <th className="py-3 px-4">Plazo Legal</th>
                                <th className="py-3 px-4">Semáforo</th>
                                <th className="py-3 px-4">Estado Trámite</th>
                                <th className="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f2937] text-xs">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={8} className="py-4 px-4">
                                            <div className="h-4 bg-[#1f2937] rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 px-4 text-center">
                                        <div className="max-w-sm mx-auto space-y-2">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto">
                                                <FileCheck2 className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">
                                                No se encontraron trámites
                                            </p>
                                            <p className="text-xs text-[#94a3b8]">
                                                {searchTerm || filtroEstado !== 'todos'
                                                    ? 'No hay registros que coincidan con los filtros aplicados.'
                                                    : 'No hay incapacidades con trámite de transcripción pendiente.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => {
                                    const expCode = `INC-${item.id_incapacidad.toString().padStart(4, '0')}`

                                    return (
                                        <tr
                                            key={item.id_incapacidad}
                                            className="hover:bg-[#1a2234] transition-colors group"
                                        >
                                            {/* Expediente */}
                                            <td className="py-3 px-4">
                                                <Link
                                                    href={`/incapacidades/${item.id_incapacidad}`}
                                                    className="font-mono font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline"
                                                >
                                                    <span>{expCode}</span>
                                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                                                </Link>
                                                <div className="text-[11px] text-white font-medium truncate max-w-[160px] mt-0.5">
                                                    {item.titulo}
                                                </div>
                                            </td>

                                            {/* Entidad */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 font-medium text-white">
                                                    <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                    <span className="truncate max-w-[130px]">
                                                        {item.entidad?.nombre || 'EPS / ARL'}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-[#64748b] block mt-0.5">
                                                    {item.entidad?.tipo || 'Entidad'}
                                                </span>
                                            </td>

                                            {/* Tipo Incapacidad */}
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1e293b] text-[#cbd5e1] border border-[#334155]">
                                                    {item.tipo?.nombre || 'General'}
                                                </span>
                                            </td>

                                            {/* Fechas */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 text-white font-mono text-[11px]">
                                                    <Calendar className="h-3 w-3 text-[#64748b]" />
                                                    <span>{item.fecha_inicio || '-'}</span>
                                                </div>
                                                <div className="text-[11px] text-[#64748b] font-mono pl-4">
                                                    al {item.fecha_fin || '-'}
                                                </div>
                                            </td>

                                            {/* Plazo Legal */}
                                            <td className="py-3 px-4">
                                                <div className="text-white font-mono text-[11px]">
                                                    {item.fecha_limite_transcripcion || 'N/A'}
                                                </div>
                                                <span className="text-[10px] text-[#64748b] block mt-0.5">
                                                    Término: {item.entidad?.plazo_transcripcion_dias || 3}d
                                                </span>
                                            </td>

                                            {/* Semáforo */}
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {renderSemaforoBadge(item)}
                                            </td>

                                            {/* Estado Trámite */}
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {item.estado_transcripcion === 'en_proceso' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        <Clock className="h-3 w-3" />
                                                        <span>En Proceso</span>
                                                    </span>
                                                ) : item.estado_transcripcion === 'completado' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>Completado</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Pendiente</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Acciones */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Botón Marcar En Proceso */}
                                                    {item.estado_transcripcion === 'pendiente' && (
                                                        <button
                                                            onClick={() => handleMarcarEnProceso(item.id_incapacidad)}
                                                            disabled={updatingId === item.id_incapacidad}
                                                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1 disabled:opacity-50"
                                                            title="Marcar como trámite en proceso"
                                                        >
                                                            <Play className="h-3 w-3" />
                                                            <span className="hidden sm:inline">En Proceso</span>
                                                        </button>
                                                    )}

                                                    {/* Botón Radicar / Transcribir */}
                                                    {item.estado_transcripcion !== 'completado' && (
                                                        <button
                                                            onClick={() => openTranscribirModal(item)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition flex items-center gap-1.5"
                                                            title="Registrar número de radicado ante EPS/ARL"
                                                        >
                                                            <Send className="h-3 w-3" />
                                                            <span>Radicar</span>
                                                        </button>
                                                    )}

                                                    {/* Ver Plazos Legales y Alertas (Task 4.2.1) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedPlazosItem({
                                                            id: item.id_incapacidad,
                                                            titulo: item.titulo,
                                                            entidadNombre: item.entidad?.nombre,
                                                        })}
                                                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition"
                                                        title="Ver plazos legales y alertas de vencimiento"
                                                    >
                                                        <Clock className="h-3.5 w-3.5" />
                                                    </button>

                                                    {/* Ver Detalle */}
                                                    <Link
                                                        href={`/incapacidades/${item.id_incapacidad}`}
                                                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1f2937] transition"
                                                        title="Ver detalle del expediente"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer resumen */}
                <div className="px-4 py-3 bg-[#0f172a]/60 border-t border-[#1f2937] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748b] gap-2">
                    <span>
                        Mostrando {filteredItems.length} de {items.length} trámites de radicación
                    </span>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            <span>Verde: &gt;5 días</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                            <span>Amarillo: 1-5 días</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                            <span>Rojo: ≤0 días / Vencida</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal de Transcripción */}
            <ModalTranscribir
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    showToast('¡Incapacidad radicada y transcrita exitosamente!')
                    fetchData()
                }}
                item={selectedItemForTranscribir}
            />

            {/* Modal de Plazos y Vencimientos Legales (Task 4.2.1) */}
            <ModalDetallePlazos
                isOpen={!!selectedPlazosItem}
                onClose={() => setSelectedPlazosItem(null)}
                incapacidadId={selectedPlazosItem?.id ?? null}
                titulo={selectedPlazosItem?.titulo}
                entidadNombre={selectedPlazosItem?.entidadNombre}
            />
        </div>
    )
}

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    PhoneCall,
    Scale,
    FileText,
    Plus,
    Search,
    RefreshCw,
    Clock,
    CheckCircle2,
    AlertCircle,
    LayoutList,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import {
    getSeguimientos,
    TIPOS_SEGUIMIENTO,
    RESULTADOS_SEGUIMIENTO,
} from '@/services/cobro.service'
import type { Seguimiento } from '@/contracts/cobros'
import { ModalCrearSeguimiento } from '@/components/cobros/ModalCrearSeguimiento'
import { SeguimientosTimeline } from '@/components/cobros/SeguimientosTimeline'
import { SeguimientosTable } from '@/components/cobros/SeguimientosTable'

export default function SeguimientosPage() {
    const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTipo, setSelectedTipo] = useState<string>('todos')
    const [selectedResultado, setSelectedResultado] = useState<string>('todos')
    const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

    // Pagination
    const [page, setPage] = useState(1)
    const [limit] = useState(25)
    const [totalItems, setTotalItems] = useState(0)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchSeguimientos = useCallback(async () => {
        try {
            const params: { tipo_seguimiento?: string; page?: number; limit?: number } = {
                page,
                limit,
            }
            if (selectedTipo !== 'todos') {
                params.tipo_seguimiento = selectedTipo
            }

            const response = await getSeguimientos(params)
            setSeguimientos(response.items || [])
            setTotalItems(response.total || (response.items ? response.items.length : 0))
            setErrorMsg(null)
        } catch (err: unknown) {
            console.error('Error al cargar seguimientos:', err)
            let msg = 'Error al cargar los seguimientos de cobro.'
            if (err instanceof Error) {
                msg = err.message
            }
            setErrorMsg(msg)
        }
    }, [page, limit, selectedTipo])

    useEffect(() => {
        let isMounted = true
        async function load() {
            try {
                const params: { tipo_seguimiento?: string; page?: number; limit?: number } = {
                    page,
                    limit,
                }
                if (selectedTipo !== 'todos') {
                    params.tipo_seguimiento = selectedTipo
                }
                const response = await getSeguimientos(params)
                if (isMounted) {
                    setSeguimientos(response.items || [])
                    setTotalItems(response.total || (response.items ? response.items.length : 0))
                    setLoading(false)
                }
            } catch (err: unknown) {
                if (isMounted) {
                    let msg = 'Error al cargar los seguimientos de cobro.'
                    if (err instanceof Error) msg = err.message
                    setErrorMsg(msg)
                    setLoading(false)
                }
            }
        }
        load()
        return () => { isMounted = false }
    }, [page, limit, selectedTipo])

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchSeguimientos()
        setRefreshing(false)
    }

    const handleCreated = (nuevo: Seguimiento) => {
        setSuccessMsg(`Seguimiento #${nuevo.id_seguimiento} registrado exitosamente para la incapacidad #${nuevo.id_incapacidad}.`)
        setTimeout(() => setSuccessMsg(null), 5000)
        handleRefresh()
    }

    // Client-side filtering by search term and resultado
    const filteredSeguimientos = useMemo(() => {
        return seguimientos.filter((item) => {
            const matchesSearch =
                searchTerm === '' ||
                item.id_incapacidad.toString().includes(searchTerm) ||
                item.id_seguimiento.toString().includes(searchTerm) ||
                item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tipo_seguimiento.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesResultado =
                selectedResultado === 'todos' ||
                (item.resultado || item.resultado_seguimiento)?.toLowerCase() ===
                    selectedResultado.toLowerCase()

            return matchesSearch && matchesResultado
        })
    }, [seguimientos, searchTerm, selectedResultado])

    // Metrics computation
    const metrics = useMemo(() => {
        const total = totalItems || seguimientos.length
        let persuasivos = 0
        let juridicos = 0
        let positivos = 0

        seguimientos.forEach((s) => {
            const tipoLower = s.tipo_seguimiento.toLowerCase()
            const resLower = (s.resultado || s.resultado_seguimiento || '').toLowerCase()

            if (tipoLower.includes('pers')) persuasivos++
            if (tipoLower.includes('jur')) juridicos++
            if (
                resLower.includes('aprob') ||
                resLower.includes('favor') ||
                resLower.includes('pago')
            ) {
                positivos++
            }
        })

        return { total, persuasivos, juridicos, positivos }
    }, [seguimientos, totalItems])

    const totalPages = Math.ceil(totalItems / limit) || 1

    return (
        <div className="space-y-6 pb-12">
            {/* Header and Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                <div className="flex items-start sm:items-center gap-3">
                    <Link
                        href="/cobros"
                        className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#94a3b8] hover:text-white transition mt-0.5 sm:mt-0"
                        title="Volver a Gestión de Cobro"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Seguimiento de Cobro a EPS / ARL
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Prioridad 5.1
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            Bitácora cronológica de llamadas, requerimientos persuasivos, oficios formales y cobro jurídico.
                        </p>
                    </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                        className="p-2.5 rounded-xl bg-[#111827] hover:bg-[#1e293b] border border-[#334155] text-slate-300 hover:text-white transition disabled:opacity-50"
                        title="Actualizar seguimientos"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Registrar Seguimiento</span>
                    </button>
                </div>
            </div>

            {/* Success / Error Alerts */}
            {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-xs animate-in slide-in-from-top-1">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <p className="font-medium">{successMsg}</p>
                </div>
            )}
            {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs animate-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p className="font-medium">{errorMsg}</p>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">Total Gestiones</span>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <PhoneCall className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                        {metrics.total}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Interacciones registradas
                    </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">Cobro Persuasivo</span>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <FileText className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400 tracking-tight">
                        {metrics.persuasivos}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Requerimientos de cartera
                    </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">Cobro Jurídico</span>
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                            <Scale className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-400 tracking-tight">
                        {metrics.juridicos}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Demandas y tutelas
                    </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">Acuerdos / Aprobados</span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 tracking-tight">
                        {metrics.positivos}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Resultados favorables
                    </p>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#334155] space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search box */}
                    <div className="relative flex-1">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar en seguimientos por ID de incapacidad, nota, o palabra clave..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Filter by Tipo */}
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedTipo}
                            onChange={(e) => {
                                setSelectedTipo(e.target.value)
                                setPage(1)
                            }}
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                        >
                            <option value="todos">Todos los Tipos de Gestión</option>
                            {TIPOS_SEGUIMIENTO.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>

                        {/* Filter by Resultado */}
                        <select
                            value={selectedResultado}
                            onChange={(e) => setSelectedResultado(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                        >
                            <option value="todos">Todos los Resultados</option>
                            {RESULTADOS_SEGUIMIENTO.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>

                        {/* View Switcher: Timeline vs Table */}
                        <div className="flex items-center p-1 rounded-xl bg-[#0f172a] border border-[#334155]">
                            <button
                                type="button"
                                onClick={() => setViewMode('timeline')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                                    viewMode === 'timeline'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-[#94a3b8] hover:text-white'
                                }`}
                                title="Vista Línea de Tiempo"
                            >
                                <Clock className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Timeline</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                                    viewMode === 'table'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-[#94a3b8] hover:text-white'
                                }`}
                                title="Vista Tabla"
                            >
                                <LayoutList className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Tabla</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active filter summary tag if any */}
                {(searchTerm || selectedTipo !== 'todos' || selectedResultado !== 'todos') && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                        <span>Filtros activos:</span>
                        {searchTerm && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                                Texto: &quot;{searchTerm}&quot;
                            </span>
                        )}
                        {selectedTipo !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px]">
                                Tipo: {selectedTipo}
                            </span>
                        )}
                        {selectedResultado !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px]">
                                Resultado: {selectedResultado}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedTipo('todos')
                                setSelectedResultado('todos')
                            }}
                            className="text-xs text-blue-400 hover:underline ml-2"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Follow-up View: Timeline vs Table */}
            <div>
                {viewMode === 'timeline' ? (
                    <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#334155]">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#334155]">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">
                                    Línea de Tiempo de Interacciones ({filteredSeguimientos.length})
                                </h3>
                            </div>
                            <span className="text-xs text-[#94a3b8]">
                                Mostrando de más reciente a más antiguo
                            </span>
                        </div>
                        <SeguimientosTimeline
                            seguimientos={filteredSeguimientos}
                            isLoading={loading}
                            onOpenModal={() => setIsModalOpen(true)}
                            showIncapacidadLink={true}
                        />
                    </div>
                ) : (
                    <SeguimientosTable
                        seguimientos={filteredSeguimientos}
                        isLoading={loading}
                        onOpenModal={() => setIsModalOpen(true)}
                    />
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#111827] border border-[#334155] text-xs text-[#94a3b8]">
                    <span>
                        Página <strong className="text-white">{page}</strong> de{' '}
                        <strong className="text-white">{totalPages}</strong> ({totalItems} total)
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1 || loading}
                            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-slate-300 hover:text-white disabled:opacity-40 transition"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || loading}
                            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] text-slate-300 hover:text-white disabled:opacity-40 transition"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for Creating Follow-up */}
            <ModalCrearSeguimiento
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreated}
            />
        </div>
    )
}

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    Plus,
    Search,
    RefreshCw,
    AlertCircle,
} from 'lucide-react'
import {
    getPagos,
    conciliarPago,
    TIPOS_PAGO,
    ESTADOS_PAGO,
} from '@/services/cobro.service'
import { getIncapacidades } from '@/services/incapacidad.service'
import type { Pago } from '@/contracts/cobros'
import type { Incapacidad } from '@/contracts/incapacidades'
import { ModalRegistrarPago } from '@/components/cobros/ModalRegistrarPago'
import { PagosComparativaTable } from '@/components/cobros/PagosComparativaTable'

export default function PagosPage() {
    const [pagos, setPagos] = useState<Pago[]>([])
    const [incapacidadesMap, setIncapacidadesMap] = useState<Map<number, Incapacidad>>(new Map())
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEstado, setSelectedEstado] = useState<string>('todos')
    const [selectedTipo, setSelectedTipo] = useState<string>('todos')
    const [diferenciaFilter, setDiferenciaFilter] = useState<'todos' | 'con_diferencia' | 'completos'>('todos')

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false)

    const loadData = useCallback(async () => {
        try {
            setErrorMsg(null)

            const [pagosRes, incsRes] = await Promise.all([
                getPagos({ limit: 100 }),
                getIncapacidades({ limit: 100 }),
            ])

            setPagos(pagosRes.items || [])

            const map = new Map<number, Incapacidad>()
            ;(incsRes.items || []).forEach((inc) => {
                map.set(inc.id_incapacidad, inc)
            })
            setIncapacidadesMap(map)
        } catch (err: unknown) {
            console.error('Error al cargar pagos:', err)
            let msg = 'Error al cargar los pagos y liquidaciones.'
            if (err instanceof Error) msg = err.message
            setErrorMsg(msg)
        }
    }, [])

    useEffect(() => {
        let isMounted = true
        async function fetchInitial() {
            setLoading(true)
            await loadData()
            if (isMounted) setLoading(false)
        }
        fetchInitial()
        return () => {
            isMounted = false
        }
    }, [loadData])

    const handleRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    const handlePagoCreated = (nuevo: Pago) => {
        setSuccessMsg(
            `Pago #${nuevo.id_pago} registrado exitosamente para la incapacidad #${nuevo.id_incapacidad}.`
        )
        setTimeout(() => setSuccessMsg(null), 5000)
        handleRefresh()
    }

    const handleConciliar = async (idPago: number) => {
        try {
            await conciliarPago(idPago, {
                conciliado: true,
                estado_pago: 'Conciliado',
            })
            setSuccessMsg(`Pago #${idPago} conciliado contablemente con éxito.`)
            setTimeout(() => setSuccessMsg(null), 5000)
            handleRefresh()
        } catch (err: unknown) {
            console.error('Error al conciliar pago:', err)
            setErrorMsg('No se pudo conciliar el pago.')
        }
    }

    // Filtered pagos list
    const filteredPagos = useMemo(() => {
        return pagos.filter((pago) => {
            const inc = incapacidadesMap.get(pago.id_incapacidad)
            const valorRecibido = parseFloat(pago.valor) || 0

            let valorEsperado = valorRecibido
            if (pago.estado_pago === 'Parcial') {
                valorEsperado = Math.round(valorRecibido * 1.35)
            } else if (inc?.fecha_inicio && inc?.fecha_fin) {
                const diffDays = Math.max(
                    1,
                    Math.floor(
                        (new Date(inc.fecha_fin).getTime() - new Date(inc.fecha_inicio).getTime()) /
                            (1000 * 60 * 60 * 24)
                    ) + 1
                )
                valorEsperado = Math.max(valorRecibido, diffDays * 55000)
            }

            const tieneDiferencia = valorEsperado > valorRecibido

            const matchesSearch =
                searchTerm === '' ||
                pago.id_pago.toString().includes(searchTerm) ||
                pago.id_incapacidad.toString().includes(searchTerm) ||
                pago.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inc?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pago.nombre_entidad || inc?.entidad?.nombre || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())

            const matchesEstado =
                selectedEstado === 'todos' ||
                pago.estado_pago.toLowerCase() === selectedEstado.toLowerCase()

            const matchesTipo =
                selectedTipo === 'todos' ||
                pago.tipo_pago.toLowerCase() === selectedTipo.toLowerCase()

            const matchesDiferencia =
                diferenciaFilter === 'todos' ||
                (diferenciaFilter === 'con_diferencia' && tieneDiferencia) ||
                (diferenciaFilter === 'completos' && !tieneDiferencia)

            return matchesSearch && matchesEstado && matchesTipo && matchesDiferencia
        })
    }, [pagos, incapacidadesMap, searchTerm, selectedEstado, selectedTipo, diferenciaFilter])

    // KPI Metrics calculation
    const metrics = useMemo(() => {
        let totalRecaudado = 0
        let conDiferencia = 0
        let conciliados = 0

        pagos.forEach((pago) => {
            const val = parseFloat(pago.valor) || 0
            totalRecaudado += val

            const inc = incapacidadesMap.get(pago.id_incapacidad)
            let valorEsperado = val
            if (pago.estado_pago === 'Parcial') {
                valorEsperado = Math.round(val * 1.35)
            } else if (inc?.fecha_inicio && inc?.fecha_fin) {
                const diffDays = Math.max(
                    1,
                    Math.floor(
                        (new Date(inc.fecha_fin).getTime() - new Date(inc.fecha_inicio).getTime()) /
                            (1000 * 60 * 60 * 24)
                    ) + 1
                )
                valorEsperado = Math.max(val, diffDays * 55000)
            }

            if (valorEsperado > val) {
                conDiferencia++
            }

            if (pago.conciliado) {
                conciliados++
            }
        })

        return {
            totalRecaudado,
            conDiferencia,
            totalPagos: pagos.length,
            conciliados,
        }
    }, [pagos, incapacidadesMap])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(val)
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
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
                                Control de Pagos y Liquidaciones
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Prioridad 5.3
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            Registro de transferencias, consignaciones bancarias, análisis de glosas y valor esperado vs recibido.
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
                        title="Actualizar pagos"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing ? 'animate-spin text-emerald-400' : ''
                            }`}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Registrar Pago</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-emerald-500/30 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">
                            Total Recaudado EPS/ARL
                        </span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 tracking-tight">
                        {formatCurrency(metrics.totalRecaudado)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Fondos efectivamente ingresados
                    </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-amber-500/30 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">
                            Diferencias / Glosas Detectadas
                        </span>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <AlertTriangle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-400 tracking-tight">
                        {metrics.conDiferencia}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Pagos con reconocimiento parcial
                    </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-blue-500/30 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">
                            Total Giros Registrados
                        </span>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                        {metrics.totalPagos}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Transacciones documentadas
                    </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1.5 hover:border-cyan-500/30 transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94a3b8] font-medium">
                            Conciliación Contable
                        </span>
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-400 tracking-tight flex items-baseline gap-1.5">
                        <span>{metrics.conciliados}</span>
                        <span className="text-xs font-normal text-slate-400">
                            ({metrics.totalPagos > 0 ? Math.round((metrics.conciliados / metrics.totalPagos) * 100) : 0}%)
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Pagos conciliados con contabilidad
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
                            placeholder="Buscar pago por ID, referencia, título o entidad..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Filter by Estado */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={selectedEstado}
                            onChange={(e) => setSelectedEstado(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="todos">Todos los Estados</option>
                            {ESTADOS_PAGO.map((esp) => (
                                <option key={esp.value} value={esp.value}>
                                    {esp.label}
                                </option>
                            ))}
                        </select>

                        {/* Filter by Tipo */}
                        <select
                            value={selectedTipo}
                            onChange={(e) => setSelectedTipo(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="todos">Todos los Tipos de Pago</option>
                            {TIPOS_PAGO.map((tp) => (
                                <option key={tp.value} value={tp.value}>
                                    {tp.label}
                                </option>
                            ))}
                        </select>

                        {/* Filter by Diferencia */}
                        <select
                            value={diferenciaFilter}
                            onChange={(e) =>
                                setDiferenciaFilter(
                                    e.target.value as 'todos' | 'con_diferencia' | 'completos'
                                )
                            }
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="todos">Todas las Liquidaciones</option>
                            <option value="con_diferencia">⚠️ Con Glosa / Diferencia</option>
                            <option value="completos">✅ Pagos Completos (100%)</option>
                        </select>
                    </div>
                </div>

                {/* Active filter pills */}
                {(searchTerm ||
                    selectedEstado !== 'todos' ||
                    selectedTipo !== 'todos' ||
                    diferenciaFilter !== 'todos') && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                        <span>Filtros activos:</span>
                        {searchTerm && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                                Texto: &quot;{searchTerm}&quot;
                            </span>
                        )}
                        {selectedEstado !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                                Estado: {selectedEstado}
                            </span>
                        )}
                        {selectedTipo !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px]">
                                Tipo: {selectedTipo}
                            </span>
                        )}
                        {diferenciaFilter !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px]">
                                {diferenciaFilter === 'con_diferencia' ? 'Con Glosa' : 'Completos'}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedEstado('todos')
                                setSelectedTipo('todos')
                                setDiferenciaFilter('todos')
                            }}
                            className="text-xs text-emerald-400 hover:underline ml-2"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Table: Valor Esperado vs Recibido & Diferencias (5.3.5) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-emerald-400" />
                        <h2 className="text-sm font-semibold text-white">
                            Liquidación Comparativa de Pagos ({filteredPagos.length})
                        </h2>
                    </div>
                    <span className="text-xs text-[#94a3b8]">
                        Comparativa de subsidio esperado vs consignado
                    </span>
                </div>

                <PagosComparativaTable
                    pagos={filteredPagos}
                    incapacidadesMap={incapacidadesMap}
                    isLoading={loading}
                    onOpenModal={() => setIsModalOpen(true)}
                    onConciliar={handleConciliar}
                />
            </div>

            {/* Modal para Registrar Pago (5.3.3 & 5.3.4) */}
            <ModalRegistrarPago
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handlePagoCreated}
            />
        </div>
    )
}

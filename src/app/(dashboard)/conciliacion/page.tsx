'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Scale,
    CheckCircle2,
    Clock,
    AlertTriangle,
    RefreshCw,
    ShieldCheck,
    FileSpreadsheet,
    AlertCircle,
    Check,
} from 'lucide-react'
import { getPagos, conciliarPago } from '@/services/cobro.service'
import { getIncapacidades } from '@/services/incapacidad.service'
import { getUsuarios } from '@/services/usuario.service'
import type { Pago } from '@/contracts/cobros'
import type { Incapacidad } from '@/contracts/incapacidades'
import type { User } from '@/contracts/auth'
import {
    ConciliacionExcelGrid,
    type ConciliacionItem,
} from '@/components/cobros/ConciliacionExcelGrid'

type TabConciliacion = 'pendientes' | 'todos' | 'conciliados'

export default function ConciliacionPage() {
    // Current filter tab
    const [currentTab, setCurrentTab] = useState<TabConciliacion>('pendientes')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Data state
    const [pagos, setPagos] = useState<Pago[]>([])
    const [incapacidadesMap, setIncapacidadesMap] = useState<Map<number, Incapacidad>>(new Map())
    const [usuariosMap, setUsuariosMap] = useState<Map<number, User>>(new Map())

    // UI state
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [successBanner, setSuccessBanner] = useState<string | null>(null)

    // Load data reactively based on tab filter and refresh trigger
    useEffect(() => {
        let isMounted = true

        let conciliadoParam: boolean | undefined = undefined
        if (currentTab === 'pendientes') conciliadoParam = false
        else if (currentTab === 'conciliados') conciliadoParam = true

        Promise.all([
            getPagos({
                conciliado: conciliadoParam,
                limit: 150,
            }),
            getIncapacidades({ limit: 150 }),
            getUsuarios({ limit: 150 }),
        ])
            .then(([pagosRes, incRes, usersRes]) => {
                if (!isMounted) return

                const incMap = new Map<number, Incapacidad>()
                ;(incRes.items || []).forEach((inc) => {
                    incMap.set(inc.id_incapacidad, inc)
                })
                setIncapacidadesMap(incMap)

                const usrMap = new Map<number, User>()
                ;(usersRes || []).forEach((u) => {
                    usrMap.set(u.id, u)
                })
                setUsuariosMap(usrMap)

                setPagos(pagosRes.items || [])
                setIsLoading(false)
                setIsRefreshing(false)
            })
            .catch((err: unknown) => {
                if (!isMounted) return
                console.error('Error al cargar datos de conciliación:', err)
                let msg = 'No se pudo cargar la información de pagos y conciliación.'
                if (err instanceof Error) msg = err.message
                setErrorMsg(msg)
                setIsLoading(false)
                setIsRefreshing(false)
            })

        return () => {
            isMounted = false
        }
    }, [currentTab, refreshTrigger])

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true)
        setErrorMsg(null)
        setRefreshTrigger((prev) => prev + 1)
    }, [])

    // Enrich pagos into spreadsheet items
    const enrichedItems: ConciliacionItem[] = useMemo(() => {
        return pagos.map((pago) => {
            const inc = incapacidadesMap.get(pago.id_incapacidad)
            const colaborador = inc?.id_usuario ? usuariosMap.get(inc.id_usuario) : undefined

            // Extraer o inferir nombre del colaborador
            let nombreColaborador = colaborador?.nombre || ''
            if (!nombreColaborador && inc?.titulo) {
                // Si el título contiene nombre (e.g., "Incapacidad - Juan Pérez")
                const parts = inc.titulo.split('-')
                if (parts.length > 1) {
                    nombreColaborador = parts[1].trim()
                } else {
                    nombreColaborador = inc.titulo
                }
            }
            if (!nombreColaborador) {
                nombreColaborador = inc?.id_usuario ? `Colaborador #${inc.id_usuario}` : 'Colaborador no asignado'
            }

            const documentoColaborador = colaborador?.numero_documento || 'Sin registrar'

            // Cálculo de días
            let diasIncapacidad = 1
            let fechasIncapacidad = '-'
            if (inc?.fecha_inicio && inc?.fecha_fin) {
                const diffTime = Math.abs(
                    new Date(inc.fecha_fin).getTime() - new Date(inc.fecha_inicio).getTime()
                )
                diasIncapacidad = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1)
                fechasIncapacidad = `${inc.fecha_inicio} a ${inc.fecha_fin}`
            }

            // Cálculo de valor recibido y esperado
            const valorPagado = parseFloat(pago.valor) || 0

            let valorEsperado = valorPagado
            if (pago.estado_pago?.toLowerCase() === 'parcial') {
                // Pago parcial: valor esperado estimado mayor (ej. 35% glosado)
                valorEsperado = Math.round(valorPagado * 1.35)
            } else if (inc?.fecha_inicio && inc?.fecha_fin) {
                const estimadoDiario = diasIncapacidad * 55000 // Tarifa estándar COP
                valorEsperado = Math.max(valorPagado, estimadoDiario)
            }

            const diferencia = valorEsperado - valorPagado
            const tieneDiferencia = diferencia > 0
            const porcentajePago = valorEsperado > 0 ? (valorPagado / valorEsperado) * 100 : 100

            // Referencia bancaria extraída de descripción o tipo
            const refMatch = pago.descripcion?.match(/\[Ref:\s*([^\]]+)\]/)
            const referencia = refMatch ? refMatch[1] : pago.descripcion || pago.tipo_pago

            return {
                id_pago: pago.id_pago,
                pago,
                incapacidad: inc,
                colaborador,
                nombreColaborador,
                documentoColaborador,
                entidadNombre: pago.nombre_entidad || inc?.entidad?.nombre || 'EPS / ARL',
                entidadTipo: inc?.entidad?.tipo || 'EPS',
                diasIncapacidad,
                fechasIncapacidad,
                valorEsperado,
                valorPagado,
                diferencia,
                porcentajePago,
                tieneDiferencia,
                estadoPago: pago.estado_pago || 'Pagado',
                conciliado: Boolean(pago.conciliado),
                fechaPago: pago.fecha_pago || '',
                periodoContable: pago.periodo_contable || '',
                referencia,
            }
        })
    }, [pagos, incapacidadesMap, usuariosMap])

    // KPI Metrics
    const kpis = useMemo(() => {
        let totalPorConciliarMonto = 0
        let totalPorConciliarCount = 0
        let totalConciliadoMonto = 0
        let totalConciliadoCount = 0
        let totalGlosasMonto = 0
        let totalGlosasCount = 0

        enrichedItems.forEach((item) => {
            if (item.conciliado) {
                totalConciliadoMonto += item.valorPagado
                totalConciliadoCount++
            } else {
                totalPorConciliarMonto += item.valorPagado
                totalPorConciliarCount++
            }

            if (item.diferencia > 0) {
                totalGlosasMonto += item.diferencia
                totalGlosasCount++
            }
        })

        const totalItems = enrichedItems.length
        const tasaConciliacion = totalItems > 0 ? Math.round((totalConciliadoCount / totalItems) * 100) : 0

        return {
            totalPorConciliarMonto,
            totalPorConciliarCount,
            totalConciliadoMonto,
            totalConciliadoCount,
            totalGlosasMonto,
            totalGlosasCount,
            tasaConciliacion,
        }
    }, [enrichedItems])

    // Toggle single conciliation (Task 6.1.3)
    const handleToggleConciliar = async (idPago: number, nuevoEstado: boolean) => {
        try {
            await conciliarPago(idPago, {
                conciliado: nuevoEstado,
                estado_pago: nuevoEstado ? 'Conciliado' : 'En proceso',
            })

            // Optimistic update
            setPagos((prev) =>
                prev.map((p) => {
                    if (p.id_pago === idPago) {
                        return {
                            ...p,
                            conciliado: nuevoEstado,
                            estado_pago: nuevoEstado ? 'Conciliado' : 'En proceso',
                        }
                    }
                    return p
                })
            )

            setSuccessBanner(
                nuevoEstado
                    ? `Pago #${idPago} conciliado exitosamente en contabilidad.`
                    : `Pago #${idPago} desmarcado de conciliación.`
            )

            // Auto-clear banner after 4 seconds
            setTimeout(() => setSuccessBanner(null), 4000)
        } catch (err: unknown) {
            console.error('Error al conciliar pago:', err)
            let msg = 'No se pudo actualizar el estado de conciliación.'
            if (err instanceof Error) msg = err.message
            setErrorMsg(msg)
        }
    }

    // Batch conciliation (Task 6.1.3 Batch)
    const handleBatchConciliar = async (ids: number[]) => {
        if (!ids || ids.length === 0) return
        setErrorMsg(null)

        try {
            const results = await Promise.allSettled(
                ids.map((id) =>
                    conciliarPago(id, {
                        conciliado: true,
                        estado_pago: 'Conciliado',
                    })
                )
            )

            const successfulIds = new Set<number>()
            results.forEach((res, index) => {
                if (res.status === 'fulfilled') {
                    successfulIds.add(ids[index])
                }
            })

            // Update local state for all successful items
            setPagos((prev) =>
                prev.map((p) => {
                    if (successfulIds.has(p.id_pago)) {
                        return {
                            ...p,
                            conciliado: true,
                            estado_pago: 'Conciliado',
                        }
                    }
                    return p
                })
            )

            setSuccessBanner(
                `Se conciliarion con éxito ${successfulIds.size} de ${ids.length} pagos seleccionados.`
            )
            setTimeout(() => setSuccessBanner(null), 4000)
        } catch (err: unknown) {
            console.error('Error en conciliación en lote:', err)
            setErrorMsg('Ocurrió un error al procesar la conciliación en lote.')
        }
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(val)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <Scale className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Conciliación Contable
                            </h1>
                            <p className="text-xs sm:text-sm text-[#94a3b8]">
                                Cruce financiero de valores esperados vs giros EPS/ARL, detección de glosas y marcado de diferencias
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing || isLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1e293b] border border-[#334155] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                        title="Actualizar datos contables"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {/* Success Banner */}
            {successBanner && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-emerald-400 text-xs animate-in fade-in duration-200 shadow-lg">
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0" />
                        <span className="font-medium">{successBanner}</span>
                    </div>
                    <button
                        onClick={() => setSuccessBanner(null)}
                        className="text-emerald-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3 text-rose-400 text-xs animate-in fade-in duration-200 shadow-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                    <button
                        onClick={() => setErrorMsg(null)}
                        className="text-rose-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Por Conciliar */}
                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Por Conciliar
                        </span>
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xl font-bold font-mono text-amber-400">
                        {formatCurrency(kpis.totalPorConciliarMonto)}
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                        <strong className="text-white font-mono">{kpis.totalPorConciliarCount}</strong> pago(s) pendientes de cruce
                    </p>
                </div>

                {/* 2. Total Conciliado */}
                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Total Conciliado
                        </span>
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                        {formatCurrency(kpis.totalConciliadoMonto)}
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                        <strong className="text-white font-mono">{kpis.totalConciliadoCount}</strong> pago(s) asentados en libros
                    </p>
                </div>

                {/* 3. Glosas / Diferencias */}
                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Glosas / Diferencias
                        </span>
                        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                            <AlertTriangle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xl font-bold font-mono text-rose-400">
                        {formatCurrency(kpis.totalGlosasMonto)}
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                        <strong className="text-white font-mono">{kpis.totalGlosasCount}</strong> caso(s) con faltante económico
                    </p>
                </div>

                {/* 4. Tasa de Conciliación */}
                <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[#94a3b8]">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Avance Conciliación
                        </span>
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xl font-bold font-mono text-purple-400">
                        {kpis.tasaConciliacion}%
                    </div>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, kpis.tasaConciliacion)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs (6.1.2) */}
            <div className="flex items-center gap-1 border-b border-[#334155] pb-px">
                <button
                    type="button"
                    onClick={() => setCurrentTab('pendientes')}
                    className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                        currentTab === 'pendientes'
                            ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                            : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                    }`}
                >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Pendientes de Conciliar</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300">
                        {kpis.totalPorConciliarCount}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setCurrentTab('todos')}
                    className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                        currentTab === 'todos'
                            ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                            : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                    }`}
                >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Todos los Pagos</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-[#1e293b] text-slate-300">
                        {enrichedItems.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setCurrentTab('conciliados')}
                    className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                        currentTab === 'conciliados'
                            ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                            : 'border-transparent text-[#94a3b8] hover:text-white hover:border-[#334155]'
                    }`}
                >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Conciliados</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                        {kpis.totalConciliadoCount}
                    </span>
                </button>
            </div>

            {/* Informative Discrepancies Callout */}
            {kpis.totalGlosasCount > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-300">
                    <div className="flex items-center gap-2.5">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                        <div>
                            <span className="font-semibold text-white">Discrepancias detectadas:</span> Hay{' '}
                            <strong className="text-amber-200">{kpis.totalGlosasCount} caso(s)</strong> con una diferencia acumulada de{' '}
                            <strong className="font-mono text-white">{formatCurrency(kpis.totalGlosasMonto)}</strong> respecto a la liquidación esperada.
                        </div>
                    </div>
                    <span className="text-[11px] text-[#94a3b8] self-end sm:self-center">
                        Filas resaltadas en ámbar
                    </span>
                </div>
            )}

            {/* Spreadsheet Grid Component */}
            <ConciliacionExcelGrid
                items={enrichedItems}
                isLoading={isLoading}
                onToggleConciliar={handleToggleConciliar}
                onBatchConciliar={handleBatchConciliar}
                onRefresh={handleRefresh}
            />
        </div>
    )
}

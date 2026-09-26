'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Scale,
    Search,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react'
import {
    getResumenEntidad,
    getCarteraVencida,
    ResumenEntidadData,
    CasoJuridicoItem,
} from '@/services/cartera.service'
import { getIncapacidades } from '@/services/incapacidad.service'
import { getSeguimientos } from '@/services/cobro.service'
import type { Pago, Seguimiento } from '@/contracts/cobros'
import { JuridicoKPICards } from '@/components/cobros/JuridicoKPICards'
import { CasosJuridicosTable } from '@/components/cobros/CasosJuridicosTable'
import { ModalEscalacionJuridica } from '@/components/cobros/ModalEscalacionJuridica'
import { ModalCrearSeguimiento } from '@/components/cobros/ModalCrearSeguimiento'

export default function CobroJuridicoPage() {
    const [casos, setCasos] = useState<CasoJuridicoItem[]>([])
    const [resumenEntidades, setResumenEntidades] = useState<ResumenEntidadData[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMoraFilter, setSelectedMoraFilter] = useState<'todos' | '180' | '90'>('todos')
    const [selectedEntidad, setSelectedEntidad] = useState<string>('todos')

    // Modals
    const [isEscalacionModalOpen, setIsEscalacionModalOpen] = useState(false)
    const [seguimientoModalData, setSeguimientoModalData] = useState<{
        isOpen: boolean
        idIncapacidad?: number
        titulo?: string
        entidad?: string
    }>({ isOpen: false })

    const loadData = useCallback(async () => {
        try {
            setErrorMsg(null)

            const [incapacidadesRes, resumenRes, vencidosRes, seguimientosRes] =
                await Promise.all([
                    getIncapacidades({ limit: 100 }),
                    getResumenEntidad(),
                    getCarteraVencida(),
                    getSeguimientos({ tipo_seguimiento: 'Jurídico', limit: 100 }),
                ])

            setResumenEntidades(resumenRes || [])

            const incapacidades = incapacidadesRes.items || []
            const pagosVencidos = vencidosRes || []
            const seguimientosJuridicos = seguimientosRes.items || []

            // Map legal followups by Incapacidad ID
            const seguimientosMap = new Map<number, Seguimiento>()
            seguimientosJuridicos.forEach((s) => {
                if (!seguimientosMap.has(s.id_incapacidad)) {
                    seguimientosMap.set(s.id_incapacidad, s)
                }
            })

            // Map payments by Incapacidad ID
            const pagosMap = new Map<number, Pago>()
            pagosVencidos.forEach((p) => {
                if (!pagosMap.has(p.id_incapacidad)) {
                    pagosMap.set(p.id_incapacidad, p)
                }
            })

            const now = new Date()

            // Calculate legal items
            const casosMapeados: CasoJuridicoItem[] = []

            incapacidades.forEach((inc) => {
                const estadoNombre = inc.estado?.nombre || ''
                const isEstadoJuridico =
                    estadoNombre.toLowerCase().includes('jur') ||
                    estadoNombre.toLowerCase().includes('legal')
                const hasSeguimientoJuridico = seguimientosMap.has(inc.id_incapacidad)

                // Calculate days of mora
                let diasMora = 0
                if (inc.fecha_fin) {
                    const diffTime = now.getTime() - new Date(inc.fecha_fin).getTime()
                    diasMora = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
                } else if (inc.fecha_inicio) {
                    const diffTime = now.getTime() - new Date(inc.fecha_inicio).getTime()
                    diasMora = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
                }

                // If in Cobro juridico or high mora > 90 days with pending state
                const isCriticalOrOverdue =
                    isEstadoJuridico ||
                    hasSeguimientoJuridico ||
                    (diasMora >= 90 &&
                        (estadoNombre.toLowerCase().includes('persuasivo') ||
                            estadoNombre.toLowerCase().includes('cobro') ||
                            estadoNombre.toLowerCase().includes('pendiente')))

                if (isCriticalOrOverdue) {
                    const pagoAsociado = pagosMap.get(inc.id_incapacidad)
                    const segAsociado = seguimientosMap.get(inc.id_incapacidad)

                    // Estimate value or use payment value
                    let valorAdeudado = pagoAsociado ? pagoAsociado.valor : '0'
                    if (valorAdeudado === '0' || !valorAdeudado) {
                        valorAdeudado = '1850000'
                    }

                    // Legal status
                    let estadoJuridico = 'En cobro jurídico'
                    if (segAsociado?.resultado) {
                        estadoJuridico = segAsociado.resultado
                    } else if (diasMora >= 180) {
                        estadoJuridico = 'Mora crítica > 180 días'
                    } else if (isEstadoJuridico) {
                        estadoJuridico = 'Demanda en trámite'
                    }

                    casosMapeados.push({
                        id_incapacidad: inc.id_incapacidad,
                        titulo: inc.titulo || 'Incapacidad médica',
                        colaborador: `Colaborador #${inc.id_usuario}`,
                        entidad: inc.entidad?.nombre || 'EPS / ARL',
                        tipo_entidad: inc.entidad?.tipo || 'EPS',
                        tipo_incapacidad: inc.tipo?.nombre || 'General',
                        fecha_inicio: inc.fecha_inicio,
                        fecha_fin: inc.fecha_fin,
                        dias_mora: diasMora,
                        valor_adeudado: valorAdeudado,
                        estado_juridico: estadoJuridico,
                        ultima_actuacion: segAsociado
                            ? {
                                  fecha: segAsociado.fecha || segAsociado.created_at || '',
                                  descripcion: segAsociado.descripcion || '',
                                  resultado: segAsociado.resultado || undefined,
                              }
                            : undefined,
                    })
                }
            })

            // Sort by mora DESC
            casosMapeados.sort((a, b) => b.dias_mora - a.dias_mora)

            setCasos(casosMapeados)
        } catch (err: unknown) {
            console.error('Error al cargar datos de cobro jurídico:', err)
            let msg = 'Error al cargar los expedientes de cobro jurídico.'
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

    const handleEscalacionSuccess = (idIncapacidad: number) => {
        setSuccessMsg(
            `Incapacidad #${idIncapacidad} escalada exitosamente a Cobro Jurídico.`
        )
        setTimeout(() => setSuccessMsg(null), 5000)
        handleRefresh()
    }

    const handleSeguimientoSuccess = () => {
        setSuccessMsg('Actuación jurídica registrada en el expediente con éxito.')
        setTimeout(() => setSuccessMsg(null), 5000)
        handleRefresh()
    }

    // Filtered Casos
    const filteredCasos = useMemo(() => {
        return casos.filter((caso) => {
            const matchesSearch =
                searchTerm === '' ||
                caso.id_incapacidad.toString().includes(searchTerm) ||
                caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caso.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caso.estado_juridico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caso.ultima_actuacion?.descripcion
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())

            const matchesMora =
                selectedMoraFilter === 'todos' ||
                (selectedMoraFilter === '180' && caso.dias_mora >= 180) ||
                (selectedMoraFilter === '90' &&
                    caso.dias_mora >= 90 &&
                    caso.dias_mora < 180)

            const matchesEntidad =
                selectedEntidad === 'todos' ||
                caso.entidad.toLowerCase() === selectedEntidad.toLowerCase()

            return matchesSearch && matchesMora && matchesEntidad
        })
    }, [casos, searchTerm, selectedMoraFilter, selectedEntidad])

    // KPI Metrics calculation
    const totalCasos = casos.length
    const casosCriticos180 = casos.filter((c) => c.dias_mora >= 180).length
    const valorTotalLitigio = casos.reduce(
        (acc, c) => acc + (parseFloat(c.valor_adeudado) || 0),
        0
    )

    // Top non-compliant entity
    const topEntidadIncumplida = useMemo(() => {
        if (!resumenEntidades || resumenEntidades.length === 0) return null
        const sorted = [...resumenEntidades].sort(
            (a, b) => b.pagos_vencidos - a.pagos_vencidos
        )
        return sorted[0]
    }, [resumenEntidades])

    // Distinct entities for filter dropdown
    const distinctEntidades = useMemo(() => {
        const set = new Set<string>()
        casos.forEach((c) => {
            if (c.entidad) set.add(c.entidad)
        })
        return Array.from(set)
    }, [casos])

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
                                Cobro Jurídico & Escalación Legal
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                Prioridad 5.2
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            Gestión legal de casos en alta mora (&gt;180 días), demandas ante SuperSalud y acciones de tutela.
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
                        title="Actualizar casos jurídicos"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing ? 'animate-spin text-red-400' : ''
                            }`}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEscalacionModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-600/20 flex items-center gap-2"
                    >
                        <Scale className="h-4 w-4" />
                        <span>Escalar a Cobro Jurídico</span>
                    </button>
                </div>
            </div>

            {/* Alerts */}
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

            {/* KPI Cards: Casos Críticos, EPS Incumplidas, Casos >180 Días (5.2.2) */}
            <JuridicoKPICards
                totalCasos={totalCasos}
                casosCriticos180={casosCriticos180}
                valorTotalLitigio={valorTotalLitigio}
                topEntidadIncumplida={topEntidadIncumplida}
            />

            {/* Filters Toolbar */}
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#334155] space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar caso por ID, título, entidad o actuación..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                        />
                    </div>

                    {/* Filter by Mora */}
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedMoraFilter}
                            onChange={(e) =>
                                setSelectedMoraFilter(
                                    e.target.value as 'todos' | '180' | '90'
                                )
                            }
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-red-500"
                        >
                            <option value="todos">Todos los Rangos de Mora</option>
                            <option value="180">🚨 Mora Crítica &gt; 180 Días</option>
                            <option value="90">⚠️ Mora Prolongada (90 - 180 Días)</option>
                        </select>

                        {/* Filter by Entidad */}
                        <select
                            value={selectedEntidad}
                            onChange={(e) => setSelectedEntidad(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-300 focus:outline-none focus:border-red-500"
                        >
                            <option value="todos">Todas las Entidades</option>
                            {distinctEntidades.map((ent) => (
                                <option key={ent} value={ent}>
                                    {ent}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active filter pills */}
                {(searchTerm ||
                    selectedMoraFilter !== 'todos' ||
                    selectedEntidad !== 'todos') && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#334155]/60 text-xs text-[#94a3b8]">
                        <span>Filtros activos:</span>
                        {searchTerm && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                                Texto: &quot;{searchTerm}&quot;
                            </span>
                        )}
                        {selectedMoraFilter !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[11px]">
                                Mora: &gt;{selectedMoraFilter} días
                            </span>
                        )}
                        {selectedEntidad !== 'todos' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px]">
                                Entidad: {selectedEntidad}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedMoraFilter('todos')
                                setSelectedEntidad('todos')
                            }}
                            className="text-xs text-red-400 hover:underline ml-2"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Table of Legal Cases with Mora & Values (5.2.3) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-red-400" />
                        <h2 className="text-sm font-semibold text-white">
                            Expedientes de Cobro Jurídico y Casos Críticos ({filteredCasos.length})
                        </h2>
                    </div>
                    <span className="text-xs text-[#94a3b8]">
                        Ordenado por mayor tiempo de mora acumulada
                    </span>
                </div>

                <CasosJuridicosTable
                    casos={filteredCasos}
                    isLoading={loading}
                    onOpenEscalacion={() => setIsEscalacionModalOpen(true)}
                    onOpenSeguimiento={(id, titulo, entidad) =>
                        setSeguimientoModalData({
                            isOpen: true,
                            idIncapacidad: id,
                            titulo,
                            entidad,
                        })
                    }
                />
            </div>

            {/* Modal de Escalación Jurídica (5.2.4) */}
            <ModalEscalacionJuridica
                isOpen={isEscalacionModalOpen}
                onClose={() => setIsEscalacionModalOpen(false)}
                onSuccess={handleEscalacionSuccess}
            />

            {/* Modal para Registrar Actuación Jurídica */}
            <ModalCrearSeguimiento
                isOpen={seguimientoModalData.isOpen}
                onClose={() =>
                    setSeguimientoModalData({ isOpen: false })
                }
                onSuccess={handleSeguimientoSuccess}
                preselectedIncapacidadId={seguimientoModalData.idIncapacidad}
                preselectedIncapacidadTitle={seguimientoModalData.titulo}
                preselectedEntidad={seguimientoModalData.entidad}
            />
        </div>
    )
}

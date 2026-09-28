'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
    LayoutDashboard,
    PlusCircle,
    RefreshCw,
} from 'lucide-react'
import { getIncapacidades } from '@/services/incapacidad.service'
import { getUsuarios } from '@/services/usuario.service'
import type { Incapacidad } from '@/contracts/incapacidades'
import type { User } from '@/contracts/auth'
import { DashboardKPICards } from '@/components/dashboard/DashboardKPICards'
import { DashboardPieChart } from '@/components/dashboard/DashboardPieChart'
import { DashboardBarChart } from '@/components/dashboard/DashboardBarChart'
import { DashboardAlertCards } from '@/components/dashboard/DashboardAlertCards'
import { DashboardRecentTable } from '@/components/dashboard/DashboardRecentTable'

export default function DashboardPage() {
    const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
    const [usuariosMap, setUsuariosMap] = useState<Map<number, User>>(new Map())
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Data fetching
    useEffect(() => {
        let isMounted = true

        Promise.all([
            getIncapacidades({ limit: 150 }),
            getUsuarios({ limit: 150 }),
        ])
            .then(([incRes, usersRes]) => {
                if (!isMounted) return

                const items = incRes?.items || []
                setIncapacidades(items)

                const usrMap = new Map<number, User>()
                ;(usersRes || []).forEach((u) => {
                    usrMap.set(u.id, u)
                })
                setUsuariosMap(usrMap)

                setIsLoading(false)
                setIsRefreshing(false)
            })
            .catch((err) => {
                if (!isMounted) return
                console.error('Error al cargar dashboard:', err)
                setIsLoading(false)
                setIsRefreshing(false)
            })

        return () => {
            isMounted = false
        }
    }, [refreshTrigger])

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true)
        setRefreshTrigger((prev) => prev + 1)
    }, [])

    // KPI Metrics calculation (7.1.2)
    const kpiMetrics = useMemo(() => {
        let activas = 0
        let pendientes = 0
        let pagadas = 0
        let rechazadas = 0

        incapacidades.forEach((inc) => {
            const estado = inc.estado?.nombre?.toLowerCase() || ''

            if (estado.includes('recha')) {
                rechazadas++
            } else if (
                estado.includes('pagad') ||
                estado.includes('conciliad') ||
                estado.includes('cobrad')
            ) {
                pagadas++
            } else if (
                estado.includes('pend') ||
                estado.includes('transcri') ||
                estado.includes('validac') ||
                estado.includes('verific')
            ) {
                pendientes++
                activas++
            } else if (!estado.includes('archiv') && !estado.includes('cerrad')) {
                activas++
            }
        })

        return {
            totalActivas: activas,
            totalPendientes: pendientes,
            totalPagadas: pagadas,
            totalRechazadas: rechazadas,
        }
    }, [incapacidades])

    // Distribution by Status (Pie Chart 7.1.3)
    const estadoCounts = useMemo(() => {
        const counts: Record<string, number> = {}

        incapacidades.forEach((inc) => {
            const estadoNombre = inc.estado?.nombre || 'Recibida'
            counts[estadoNombre] = (counts[estadoNombre] || 0) + 1
        })

        return counts
    }, [incapacidades])

    // Distribution by Entity (Bar Chart 7.1.4)
    const entidadCounts = useMemo(() => {
        const counts: Record<string, { count: number; tipo: string }> = {}

        incapacidades.forEach((inc) => {
            const entidadNombre = inc.entidad?.nombre || 'EPS no asignada'
            const tipo = inc.entidad?.tipo || 'EPS'

            if (!counts[entidadNombre]) {
                counts[entidadNombre] = { count: 0, tipo }
            }
            counts[entidadNombre].count++
        })

        return counts
    }, [incapacidades])

    // Alert Metrics calculation (7.1.5)
    const alertMetrics = useMemo(() => {
        let documentosFaltantes = 0
        let casosMasDe90Dias = 0
        let pagosRetrasados = 0
        let casosJuridicos = 0

        incapacidades.forEach((inc) => {
            const estado = inc.estado?.nombre?.toLowerCase() || ''

            // Documentos faltantes
            if (estado.includes('incompleta') || estado.includes('validac')) {
                documentosFaltantes++
            }

            // Casos > 90 días
            if (inc.fecha_inicio && inc.fecha_fin) {
                const diffTime = Math.abs(
                    new Date(inc.fecha_fin).getTime() - new Date(inc.fecha_inicio).getTime()
                )
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                if (days > 90) {
                    casosMasDe90Dias++
                }
            }

            // Pagos retrasados / mora
            if (estado.includes('pendiente pago') || estado.includes('mora') || estado.includes('cobro persuasivo')) {
                pagosRetrasados++
            }

            // Casos jurídicos
            if (estado.includes('jurid') || estado.includes('juríd')) {
                casosJuridicos++
            }
        })

        return {
            documentosFaltantes,
            casosMasDe90Dias,
            pagosRetrasados,
            casosJuridicos,
        }
    }, [incapacidades])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <LayoutDashboard className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Dashboard Operativo
                            </h1>
                            <p className="text-xs sm:text-sm text-[#94a3b8]">
                                Monitoreo integral en tiempo real de incapacidades, términos EPS/ARL y alertas legales
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing || isLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111827] hover:bg-[#1e293b] border border-[#334155] text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
                        title="Actualizar métricas"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Actualizar</span>
                    </button>

                    <Link
                        href="/incapacidades/crear"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Radicar Incapacidad</span>
                    </Link>
                </div>
            </div>

            {/* 7.1.2 Top KPI Cards */}
            <DashboardKPICards
                totalActivas={kpiMetrics.totalActivas}
                totalPendientes={kpiMetrics.totalPendientes}
                totalPagadas={kpiMetrics.totalPagadas}
                totalRechazadas={kpiMetrics.totalRechazadas}
                isLoading={isLoading}
            />

            {/* Charts Grid: 7.1.3 Pie Chart & 7.1.4 Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardPieChart
                    estadoCounts={estadoCounts}
                    total={incapacidades.length}
                    isLoading={isLoading}
                />
                <DashboardBarChart
                    entidadCounts={entidadCounts}
                    total={incapacidades.length}
                    isLoading={isLoading}
                />
            </div>

            {/* 7.1.5 Alert Cards */}
            <DashboardAlertCards
                documentosFaltantes={alertMetrics.documentosFaltantes}
                casosMasDe90Dias={alertMetrics.casosMasDe90Dias}
                pagosRetrasados={alertMetrics.pagosRetrasados}
                casosJuridicos={alertMetrics.casosJuridicos}
                isLoading={isLoading}
            />

            {/* 7.1.6 Tabla Últimas Incapacidades */}
            <DashboardRecentTable
                incapacidades={incapacidades}
                usuariosMap={usuariosMap}
                isLoading={isLoading}
            />
        </div>
    )
}

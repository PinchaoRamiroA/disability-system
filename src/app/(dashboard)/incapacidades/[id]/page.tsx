'use client'

import React, { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import type { Incapacidad } from '@/contracts/incapacidades'
import { incapacidadService } from '@/services/incapacidad.service'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function IncapacidadDetailPage({ params }: PageProps) {
    const { id } = use(params)
    const [incapacidad, setIncapacidad] = useState<Incapacidad | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchDetail() {
            setIsLoading(true)
            setError(null)
            try {
                const data = await incapacidadService.getIncapacidadById(id)
                setIncapacidad(data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('No se pudo cargar el detalle de la incapacidad.')
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchDetail()
    }, [id])

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/incapacidades"
                        className="p-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#94a3b8] hover:text-white transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Incapacidad #{id}
                            </h1>
                            {incapacidad?.estado && (
                                <StatusBadge status={incapacidad.estado.nombre} />
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            {incapacidad?.titulo || 'Detalle del caso y trazabilidad'}
                        </p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] animate-pulse space-y-4">
                    <div className="h-6 bg-[#1e293b] rounded w-1/3"></div>
                    <div className="h-4 bg-[#1e293b] rounded w-1/2"></div>
                </div>
            ) : error ? (
                <div className="p-6 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-amber-400 mx-auto" />
                    <p className="text-sm text-white font-medium">{error}</p>
                    <Link
                        href="/incapacidades"
                        className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                    >
                        Volver al listado
                    </Link>
                </div>
            ) : incapacidad ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* General Info */}
                    <div className="lg:col-span-2 p-6 rounded-xl bg-[#111827] border border-[#334155] space-y-4">
                        <h2 className="text-sm font-semibold text-white">Información General</h2>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-[#94a3b8] block">Entidad</span>
                                <span className="text-white font-medium">
                                    {incapacidad.entidad?.nombre} ({incapacidad.entidad?.tipo})
                                </span>
                            </div>
                            <div>
                                <span className="text-[#94a3b8] block">Tipo de Incapacidad</span>
                                <span className="text-white font-medium">
                                    {incapacidad.tipo?.nombre}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#94a3b8] block">Fecha de Inicio</span>
                                <span className="text-white font-medium">
                                    {incapacidad.fecha_inicio}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#94a3b8] block">Fecha de Fin</span>
                                <span className="text-white font-medium">
                                    {incapacidad.fecha_fin}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#94a3b8] block">Origen</span>
                                <span className="text-white font-medium capitalize">
                                    {incapacidad.origen?.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#94a3b8] block">Canal de Recepción</span>
                                <span className="text-white font-medium capitalize">
                                    {incapacidad.canal_recepcion}
                                </span>
                            </div>
                        </div>

                        {incapacidad.observaciones && (
                            <div className="pt-3 border-t border-[#334155]">
                                <span className="text-[#94a3b8] block text-xs mb-1">
                                    Observaciones
                                </span>
                                <p className="text-xs text-[#cbd5e1] bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                                    {incapacidad.observaciones}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Timeline / Status Card */}
                    <div className="p-6 rounded-xl bg-[#111827] border border-[#334155] space-y-3">
                        <h2 className="text-sm font-semibold text-white">Estado del Trámite</h2>
                        <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] space-y-1">
                            <span className="text-[11px] text-[#94a3b8]">Estado Actual</span>
                            <StatusBadge status={incapacidad.estado?.nombre} />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

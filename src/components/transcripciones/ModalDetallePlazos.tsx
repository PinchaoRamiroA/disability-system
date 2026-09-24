'use client'

import React, { useState, useEffect } from 'react'
import {
    X,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    FileText,
    Building2,
    ExternalLink,
    Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { PlazosInfo } from '@/contracts/incapacidades'
import { getIncapacidadPlazos } from '@/services/incapacidad.service'

interface ModalDetallePlazosProps {
    isOpen: boolean
    onClose: () => void
    incapacidadId: number | null
    titulo?: string
    entidadNombre?: string
}

function ModalDetallePlazosContent({
    onClose,
    incapacidadId,
    titulo,
    entidadNombre,
}: {
    onClose: () => void
    incapacidadId: number
    titulo?: string
    entidadNombre?: string
}) {
    const [plazos, setPlazos] = useState<PlazosInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        getIncapacidadPlazos(incapacidadId)
            .then((res) => {
                if (isMounted) {
                    setPlazos(res)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError('No se pudo cargar la información de plazos legales.')
                    console.error(err)
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [incapacidadId])

    const expCode = `INC-${incapacidadId.toString().padStart(4, '0')}`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl bg-[#111827] border border-[#334155] shadow-2xl overflow-hidden my-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937] bg-[#0f172a]/70">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                    Términos y Plazos Legales
                                </h2>
                                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {expCode}
                                </span>
                            </div>
                            <p className="text-xs text-[#94a3b8]">
                                {titulo || 'Control de vencimientos y alertas perentorias'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1f2937] transition"
                        title="Cerrar modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#94a3b8]">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                            <span className="text-xs font-medium">Consultando plazos legales...</span>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : plazos ? (
                        <>
                            {/* Alertas de Vencimiento Próximo */}
                            {plazos.alertas_vencimiento && plazos.alertas_vencimiento.length > 0 ? (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                                        <AlertTriangle className="h-4 w-4 shrink-0" />
                                        <span>Alertas de Vencimiento Activas ({plazos.alertas_vencimiento.length})</span>
                                    </div>
                                    <ul className="space-y-1.5 text-xs text-[#cbd5e1] pl-6 list-disc">
                                        {plazos.alertas_vencimiento.map((alerta, i) => (
                                            <li key={i} className="text-amber-200/90 font-medium leading-relaxed">
                                                {alerta}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <span>No se registran alertas críticas ni términos en mora para este expediente.</span>
                                </div>
                            )}

                            {/* Resumen Días Transcurridos */}
                            <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#334155] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#94a3b8] font-medium">Días Transcurridos desde Inicio</span>
                                    <span className="font-bold text-white text-sm">
                                        {plazos.dias_transcurridos ?? 0} días calendario
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-[#1f2937] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            (plazos.dias_transcurridos ?? 0) > 180
                                                ? 'bg-rose-500'
                                                : (plazos.dias_transcurridos ?? 0) > 90
                                                ? 'bg-amber-500'
                                                : 'bg-blue-500'
                                        }`}
                                        style={{
                                            width: `${Math.min(100, ((plazos.dias_transcurridos ?? 0) / 180) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-[#64748b]">
                                    <span>0 días</span>
                                    <span>Hito 90d</span>
                                    <span>Hito 180d</span>
                                </div>
                            </div>

                            {/* Grid de los 3 Plazos Perentorios */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                {/* 1. Entrega de Soportes */}
                                <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#334155] space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                                        <FileText className="h-4 w-4 shrink-0" />
                                        <span>Entrega de Soportes</span>
                                    </div>
                                    <div className="text-sm font-bold text-white font-mono">
                                        {plazos.fecha_limite_entrega || 'N/A'}
                                    </div>
                                    <p className="text-[11px] text-[#94a3b8]">
                                        Término colaborador:{' '}
                                        <span className="text-white font-medium">
                                            {plazos.plazo_entrega_dias || 2} días hábiles
                                        </span>
                                    </p>
                                </div>

                                {/* 2. Transcripción EPS/ARL */}
                                <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#334155] space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                                        <Building2 className="h-4 w-4 shrink-0" />
                                        <span>Radicación EPS/ARL</span>
                                    </div>
                                    <div className="text-sm font-bold text-white font-mono">
                                        {plazos.fecha_limite_transcripcion || 'N/A'}
                                    </div>
                                    <p className="text-[11px] text-[#94a3b8]">
                                        Término entidad:{' '}
                                        <span className="text-white font-medium">
                                            {plazos.plazo_transcripcion_dias || 3} días hábiles
                                        </span>
                                    </p>
                                </div>

                                {/* 3. Pago Prestación Económica */}
                                <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#334155] space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>Límite Pago EPS</span>
                                    </div>
                                    <div className="text-sm font-bold text-white font-mono">
                                        {plazos.fecha_limite_pago || 'N/A'}
                                    </div>
                                    <p className="text-[11px] text-[#94a3b8]">
                                        Término legal EPS:{' '}
                                        <span className="text-white font-medium">
                                            {plazos.tiempo_maximo_pago_dias || 30} días
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Documentos Requeridos por Ley */}
                            {plazos.documentos_requeridos && plazos.documentos_requeridos.length > 0 && (
                                <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#334155] space-y-2.5">
                                    <span className="text-xs font-semibold text-[#cbd5e1] block">
                                        Documentación Exigida por Normativa ({plazos.tipo_incapacidad || 'General'})
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {plazos.documentos_requeridos.map((doc, idx) => (
                                            <div
                                                key={idx}
                                                className="p-2.5 rounded-lg bg-[#111827] border border-[#1f2937] flex items-center gap-2 text-white"
                                            >
                                                <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                <span className="truncate">{doc.nombre || doc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-[#0f172a]/70 border-t border-[#1f2937] flex items-center justify-between text-xs">
                    <span className="text-[#64748b]">
                        Entidad: <strong className="text-white">{entidadNombre || 'EPS / ARL'}</strong>
                    </span>
                    <div className="flex items-center gap-2.5">
                        <Link
                            href={`/incapacidades/${incapacidadId}`}
                            className="px-3.5 py-1.5 rounded-xl font-medium text-xs text-blue-400 hover:text-white hover:bg-blue-600/20 border border-blue-500/30 transition flex items-center gap-1.5"
                        >
                            <span>Ver Expediente Completo</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 rounded-xl font-semibold text-xs text-white bg-[#1f2937] hover:bg-[#374151] transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ModalDetallePlazos(props: ModalDetallePlazosProps) {
    if (!props.isOpen || !props.incapacidadId) return null

    return (
        <ModalDetallePlazosContent
            onClose={props.onClose}
            incapacidadId={props.incapacidadId}
            titulo={props.titulo}
            entidadNombre={props.entidadNombre}
        />
    )
}

export default ModalDetallePlazos

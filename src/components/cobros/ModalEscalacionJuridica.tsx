'use client'

import React, { useState, useEffect } from 'react'
import {
    X,
    Scale,
    AlertTriangle,
    FileText,
    UserCheck,
    CheckCircle2,
    Loader2,
    Search,
    ChevronDown,
} from 'lucide-react'
import { ejecutarEscalacionJuridica, EscalarJuridicoPayload } from '@/services/cartera.service'
import { getIncapacidades } from '@/services/incapacidad.service'
import type { Incapacidad } from '@/contracts/incapacidades'

interface ModalEscalacionJuridicaProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (idIncapacidad: number) => void
    preselectedIncapacidadId?: number
    preselectedIncapacidadTitle?: string
    preselectedEntidad?: string
}

const TIPOS_ACCION_LEGAL = [
    {
        id: 'super_salud',
        label: 'Demanda / Queja formal ante SuperSalud',
        desc: 'Reclamación de cobro de prestaciones económicas no liquidadas ante la Superintendencia',
    },
    {
        id: 'tutela',
        label: 'Acción de Tutela por Mínimo Vital',
        desc: 'Vulneración de derechos fundamentales por retención de subsidio por incapacidad',
    },
    {
        id: 'cobro_coactivo',
        label: 'Proceso Ejecutivo / Cobro Coactivo',
        desc: 'Demanda ejecutiva ante juzgado civil con título que presta mérito ejecutivo',
    },
    {
        id: 'desacato',
        label: 'Incidente de Desacato de Tutela',
        desc: 'Incumplimiento de orden judicial previa de pago impartida a la EPS',
    },
    {
        id: 'prejuridico',
        label: 'Requerimiento Pre-jurídico con Poder',
        desc: 'Última intimación perentoria antes de radicar la demanda en estrados',
    },
]

export function ModalEscalacionJuridica({
    isOpen,
    onClose,
    onSuccess,
    preselectedIncapacidadId,
    preselectedIncapacidadTitle,
    preselectedEntidad,
}: ModalEscalacionJuridicaProps) {
    const [selectedPickerId, setSelectedPickerId] = useState<number | null>(null)
    const [tipoAccion, setTipoAccion] = useState<string>(TIPOS_ACCION_LEGAL[0].label)
    const [radicado, setRadicado] = useState<string>('')
    const [abogado, setAbogado] = useState<string>('')
    const [motivo, setMotivo] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Incapacidades list for picker when not preselected
    const [incapacidadesList, setIncapacidadesList] = useState<Incapacidad[]>([])
    const [loadingIncapacidades, setLoadingIncapacidades] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showPicker, setShowPicker] = useState(false)

    const incapacidadId = preselectedIncapacidadId ?? selectedPickerId

    useEffect(() => {
        if (!isOpen || preselectedIncapacidadId) return

        let isMounted = true
        getIncapacidades({ limit: 50 })
            .then((res) => {
                if (isMounted) {
                    const list = res.items || []
                    setIncapacidadesList(list)
                    setSelectedPickerId((prev) => prev ?? (list.length > 0 ? list[0].id_incapacidad : null))
                    setLoadingIncapacidades(false)
                }
            })
            .catch((err) => {
                console.error('Error al cargar incapacidades:', err)
                if (isMounted) setLoadingIncapacidades(false)
            })

        return () => {
            isMounted = false
        }
    }, [isOpen, preselectedIncapacidadId])

    if (!isOpen) return null

    const selectedIncapacidad = incapacidadesList.find(
        (i) => i.id_incapacidad === incapacidadId
    )

    const filteredIncapacidades = incapacidadesList.filter((item) => {
        const query = searchTerm.toLowerCase()
        const idMatch = item.id_incapacidad.toString().includes(query)
        const tituloMatch = item.titulo?.toLowerCase().includes(query)
        const entidadMatch = item.entidad?.nombre?.toLowerCase().includes(query)
        return idMatch || tituloMatch || entidadMatch
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)

        if (!incapacidadId) {
            setErrorMsg('Debes seleccionar la incapacidad a escalar a cobro jurídico.')
            return
        }

        if (!motivo || motivo.trim().length < 10) {
            setErrorMsg('Ingresa la fundamentación jurídica y antecedentes de mora (mínimo 10 caracteres).')
            return
        }

        setSubmitting(true)

        try {
            const payload: EscalarJuridicoPayload = {
                id_incapacidad: incapacidadId,
                tipo_accion_legal: tipoAccion,
                radicado_juzgado_super: radicado.trim() || undefined,
                abogado_asignado: abogado.trim() || undefined,
                motivo: motivo.trim(),
                resultado_inicial: 'En revisión',
            }

            await ejecutarEscalacionJuridica(payload)
            onSuccess(incapacidadId)
            onClose()
        } catch (err: unknown) {
            console.error('Error al escalar caso a cobro jurídico:', err)
            let msg = 'No se pudo completar la escalación jurídica.'
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { message?: string } } }
                if (axiosErr.response?.data?.message) {
                    msg = axiosErr.response.data.message
                }
            } else if (err instanceof Error) {
                msg = err.message
            }
            setErrorMsg(msg)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111827] border border-[#334155] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                            <Scale className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                <span>Escalación a Cobro Jurídico</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">
                                    Vía Legal
                                </span>
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                Traslada el expediente de cobro persuasivo a proceso judicial o SuperSalud
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition disabled:opacity-50"
                        title="Cerrar modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Legal Warning Notice */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-300">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <div className="leading-relaxed">
                            <p className="font-semibold text-amber-200">
                                Transición formal de cartera a Cobro Jurídico
                            </p>
                            <p className="text-amber-300/80 mt-0.5">
                                Esta acción cambiará el estado de la incapacidad a <strong className="text-white">Cobro jurídico</strong> y registrará la actuación en la bitácora legal. Reservado para casos con mora &gt;90 o &gt;180 días con renuencia de la EPS.
                            </p>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                            {errorMsg}
                        </div>
                    )}

                    {/* Incapacidad Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Incapacidad a Escalar <span className="text-red-400">*</span>
                        </label>
                        {preselectedIncapacidadId ? (
                            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-xs font-semibold">
                                            INC #{preselectedIncapacidadId}
                                        </span>
                                        <span className="text-sm font-medium text-white">
                                            {preselectedIncapacidadTitle || 'Incapacidad seleccionada'}
                                        </span>
                                    </div>
                                    {preselectedEntidad && (
                                        <p className="text-xs text-[#94a3b8]">
                                            Entidad Demandada: <span className="text-slate-200">{preselectedEntidad}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPicker(!showPicker)}
                                    className="w-full p-3 rounded-xl bg-[#0f172a] border border-[#334155] hover:border-slate-500 text-left flex items-center justify-between text-xs text-white transition"
                                >
                                    {selectedIncapacidad ? (
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono font-semibold shrink-0">
                                                INC #{selectedIncapacidad.id_incapacidad}
                                            </span>
                                            <span className="truncate font-medium">
                                                {selectedIncapacidad.titulo || 'Sin título'}
                                            </span>
                                            <span className="text-[#94a3b8] text-[11px] shrink-0">
                                                ({selectedIncapacidad.entidad?.nombre || 'EPS'})
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">
                                            {loadingIncapacidades ? 'Cargando incapacidades...' : 'Selecciona una incapacidad para escalar...'}
                                        </span>
                                    )}
                                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                                </button>

                                {showPicker && (
                                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#0f172a] border border-[#334155] rounded-xl shadow-xl overflow-hidden max-h-56 flex flex-col">
                                        <div className="p-2 border-b border-[#334155]">
                                            <div className="relative">
                                                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Buscar por ID, título o entidad..."
                                                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#111827] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto flex-1 p-1">
                                            {filteredIncapacidades.length === 0 ? (
                                                <div className="p-3 text-center text-xs text-slate-400">
                                                    No se encontraron incapacidades
                                                </div>
                                            ) : (
                                                filteredIncapacidades.map((inc) => (
                                                    <button
                                                        type="button"
                                                        key={inc.id_incapacidad}
                                                        onClick={() => {
                                                            setSelectedPickerId(inc.id_incapacidad)
                                                            setShowPicker(false)
                                                        }}
                                                        className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition ${
                                                            inc.id_incapacidad === incapacidadId
                                                                ? 'bg-red-600/20 text-red-400 font-semibold'
                                                                : 'hover:bg-[#1e293b] text-slate-300'
                                                        }`}
                                                    >
                                                        <div className="truncate pr-2">
                                                            <span className="font-mono text-red-400 mr-2">
                                                                #{inc.id_incapacidad}
                                                            </span>
                                                            {inc.titulo}
                                                        </div>
                                                        <span className="text-[11px] text-slate-400 shrink-0">
                                                            {inc.entidad?.nombre || 'EPS'}
                                                        </span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tipo de Acción Legal */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                            Mecanismo Jurídico de Escalación <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-2">
                            {TIPOS_ACCION_LEGAL.map((accion) => {
                                const isSelected = tipoAccion === accion.label
                                return (
                                    <button
                                        type="button"
                                        key={accion.id}
                                        onClick={() => setTipoAccion(accion.label)}
                                        className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                                            isSelected
                                                ? 'bg-red-500/10 border-red-500/60 ring-1 ring-red-500/40'
                                                : 'bg-[#0f172a] border-[#334155] hover:border-slate-500/60 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg shrink-0 ${
                                                isSelected ? 'bg-red-500 text-white' : 'bg-[#1e293b] text-slate-400'
                                            }`}
                                        >
                                            <Scale className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                    {accion.label}
                                                </p>
                                                {isSelected && (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#94a3b8]">
                                                {accion.desc}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Radicado y Apoderado */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                No. Radicado / Expediente Judicial
                            </label>
                            <div className="relative">
                                <FileText className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={radicado}
                                    onChange={(e) => setRadicado(e.target.value)}
                                    placeholder="Ej: 2026-SNS-10492 ó 11001-2026-0045"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Abogado o Apoderado Responsable
                            </label>
                            <div className="relative">
                                <UserCheck className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={abogado}
                                    onChange={(e) => setAbogado(e.target.value)}
                                    placeholder="Ej: Dra. Camila Vargas (T.P. 245.890)"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fundamentación / Antecedentes */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Fundamentación Jurídica y Antecedentes de Mora <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Describa los requerimientos previos sin respuesta, mora acumulada en días, glosas injustificadas y solicitud expresa de cobro perentorio..."
                            className="w-full p-3 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none leading-relaxed"
                            required
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#334155] bg-[#0f172a]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#1e293b] hover:bg-[#334155] transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Escalando a Jurídico...</span>
                            </>
                        ) : (
                            <>
                                <Scale className="h-3.5 w-3.5" />
                                <span>Confirmar Escalación Jurídica</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
    X,
    FileText,
    PhoneCall,
    Scale,
    ShieldAlert,
    Building2,
    Calendar,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Search,
    ChevronDown,
} from 'lucide-react'
import {
    TIPOS_SEGUIMIENTO,
    RESULTADOS_SEGUIMIENTO,
    crearSeguimiento,
} from '@/services/cobro.service'
import { getIncapacidades } from '@/services/incapacidad.service'
import type { Seguimiento } from '@/contracts/cobros'
import type { Incapacidad } from '@/contracts/incapacidades'

interface ModalCrearSeguimientoProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (seguimiento: Seguimiento) => void
    preselectedIncapacidadId?: number
    preselectedIncapacidadTitle?: string
    preselectedEntidad?: string
}

const CANALES_CONTACTO = [
    { id: 'llamada', label: 'Llamada telefónica', icon: PhoneCall },
    { id: 'correo', label: 'Correo electrónico', icon: MessageSquare },
    { id: 'oficio', label: 'Oficio / Solicitud escrita', icon: FileText },
    { id: 'portal', label: 'Portal web EPS / ARL', icon: Building2 },
    { id: 'presencial', label: 'Reunión presencial / Mesa', icon: Building2 },
]

export function ModalCrearSeguimiento({
    isOpen,
    onClose,
    onSuccess,
    preselectedIncapacidadId,
    preselectedIncapacidadTitle,
    preselectedEntidad,
}: ModalCrearSeguimientoProps) {
    const [selectedPickerId, setSelectedPickerId] = useState<number | null>(null)
    const [tipoSeguimiento, setTipoSeguimiento] = useState<string>('Persuasivo')
    const [canalContacto, setCanalContacto] = useState<string>('llamada')
    const [resultado, setResultado] = useState<string>('Pendiente respuesta')
    const [fechaContacto, setFechaContacto] = useState<string>(() =>
        new Date().toISOString().split('T')[0]
    )
    const [descripcion, setDescripcion] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Incapacidades list for searchable picker when not preselected
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
                if (isMounted) {
                    setLoadingIncapacidades(false)
                }
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
        const tipoMatch = item.tipo?.nombre?.toLowerCase().includes(query)
        return idMatch || tituloMatch || entidadMatch || tipoMatch
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)

        if (!incapacidadId) {
            setErrorMsg('Debes seleccionar una incapacidad asociada al seguimiento.')
            return
        }

        if (!tipoSeguimiento) {
            setErrorMsg('Selecciona un tipo de seguimiento válido.')
            return
        }

        if (!descripcion || descripcion.trim().length < 5) {
            setErrorMsg('Ingresa una descripción detallada de la gestión (mínimo 5 caracteres).')
            return
        }

        setSubmitting(true)

        try {
            // Format contact channel into description prefix if chosen
            const canalLabel = CANALES_CONTACTO.find((c) => c.id === canalContacto)?.label || canalContacto
            const descCompleta = `[${canalLabel}] ${descripcion.trim()}`

            const nuevo = await crearSeguimiento({
                id_incapacidad: incapacidadId,
                tipo_seguimiento: tipoSeguimiento,
                descripcion: descCompleta,
                resultado: resultado,
                fecha_contacto: fechaContacto,
                fecha: fechaContacto,
            })

            onSuccess(nuevo)
            onClose()
        } catch (err: unknown) {
            console.error('Error al registrar seguimiento:', err)
            let msg = 'No se pudo registrar el seguimiento de cobro.'
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
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <PhoneCall className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Registrar Seguimiento de Cobro
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                Documenta llamadas, requerimientos persuasivos, oficios o acciones jurídicas
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

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs animate-in slide-in-from-top-1">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium">Error al registrar seguimiento</p>
                                <p className="text-red-300/80 mt-0.5">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    {/* Incapacidad Selector / Display */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Incapacidad Asociada <span className="text-red-400">*</span>
                        </label>
                        {preselectedIncapacidadId ? (
                            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-semibold">
                                            INC #{preselectedIncapacidadId}
                                        </span>
                                        <span className="text-sm font-medium text-white">
                                            {preselectedIncapacidadTitle || 'Incapacidad seleccionada'}
                                        </span>
                                    </div>
                                    {preselectedEntidad && (
                                        <p className="text-xs text-[#94a3b8]">
                                            Entidad Pagadora: <span className="text-slate-200">{preselectedEntidad}</span>
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
                                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-semibold shrink-0">
                                                INC #{selectedIncapacidad.id_incapacidad}
                                            </span>
                                            <span className="truncate font-medium">
                                                {selectedIncapacidad.titulo || 'Sin título'}
                                            </span>
                                            <span className="text-[#94a3b8] text-[11px] shrink-0">
                                                ({selectedIncapacidad.entidad?.nombre || 'Entidad'})
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">
                                            {loadingIncapacidades ? 'Cargando incapacidades...' : 'Selecciona una incapacidad...'}
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
                                                                ? 'bg-blue-600/20 text-blue-400 font-semibold'
                                                                : 'hover:bg-[#1e293b] text-slate-300'
                                                        }`}
                                                    >
                                                        <div className="truncate pr-2">
                                                            <span className="font-mono text-blue-400 mr-2">
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

                    {/* Tipo de Seguimiento Grid */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Tipo de Gestión / Proceso <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {TIPOS_SEGUIMIENTO.map((t) => {
                                const isSelected = tipoSeguimiento === t.value
                                const IconComponent =
                                    t.icon === 'Scale'
                                        ? Scale
                                        : t.icon === 'ShieldAlert'
                                        ? ShieldAlert
                                        : t.icon === 'Building2'
                                        ? Building2
                                        : t.icon === 'PhoneCall'
                                        ? PhoneCall
                                        : FileText

                                return (
                                    <button
                                        type="button"
                                        key={t.value}
                                        onClick={() => setTipoSeguimiento(t.value)}
                                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                                            isSelected
                                                ? 'bg-blue-500/10 border-blue-500/60 ring-1 ring-blue-500/40'
                                                : 'bg-[#0f172a] border-[#334155] hover:border-slate-500/60 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg shrink-0 ${
                                                isSelected
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-[#1e293b] text-slate-400'
                                            }`}
                                        >
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p
                                                    className={`text-xs font-semibold truncate ${
                                                        isSelected ? 'text-white' : 'text-slate-300'
                                                    }`}
                                                >
                                                    {t.label}
                                                </p>
                                                {isSelected && (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#94a3b8] line-clamp-2">
                                                {t.description}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Canal de Contacto & Fecha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Medio / Canal de Comunicación
                            </label>
                            <select
                                value={canalContacto}
                                onChange={(e) => setCanalContacto(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-blue-500"
                            >
                                {CANALES_CONTACTO.map((canal) => (
                                    <option key={canal.id} value={canal.id}>
                                        {canal.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Fecha de Contacto <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="date"
                                    value={fechaContacto}
                                    onChange={(e) => setFechaContacto(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resultado / Estado del Seguimiento */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Resultado o Estado de la Gestión <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {RESULTADOS_SEGUIMIENTO.map((res) => {
                                const isSelected = resultado === res.value
                                return (
                                    <button
                                        type="button"
                                        key={res.value}
                                        onClick={() => setResultado(res.value)}
                                        className={`px-3 py-2 rounded-lg border text-xs text-center transition truncate ${
                                            isSelected
                                                ? `${res.color} border-current font-medium ring-1 ring-current/30`
                                                : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                                        }`}
                                    >
                                        {res.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Descripción / Notas */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-300">
                                Detalle de la Gestión y Acuerdos <span className="text-red-400">*</span>
                            </label>
                            <span className="text-[11px] text-[#94a3b8]">
                                {descripcion.length} caracteres
                            </span>
                        </div>
                        <textarea
                            rows={4}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ej: Se contactó a la analista María Gómez (ext. 4022) en Sanitas. Confirma que la liquidación está en auditoría médica. Se comprometen a respuesta formal y giro antes del viernes 15."
                            className="w-full p-3 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                            required
                        />
                    </div>
                </form>

                {/* Footer Actions */}
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
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Registrando...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Guardar Seguimiento</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useState } from 'react'
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Eye,
    X,
    Loader2,
    Scale,
} from 'lucide-react'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import {
    validarDocumento,
    type EstadoValidacionDocumento,
} from '@/services/documento.service'

interface ModalValidarDocumentoProps {
    isOpen: boolean
    onClose: () => void
    documento: IncapacidadDocumento | null
    onValidated?: (updatedDoc: IncapacidadDocumento) => void
    onPreview?: (doc: IncapacidadDocumento) => void
}

interface ModalValidarDocumentoFormProps {
    documento: IncapacidadDocumento
    onClose: () => void
    onValidated?: (updatedDoc: IncapacidadDocumento) => void
    onPreview?: (doc: IncapacidadDocumento) => void
}

function ModalValidarDocumentoForm({
    documento,
    onClose,
    onValidated,
    onPreview,
}: ModalValidarDocumentoFormProps) {
    const [estado, setEstado] = useState<EstadoValidacionDocumento>(() => {
        const cur = documento.estado
        if (cur === 'Validado' || cur === 'Rechazado' || cur === 'Incompleto') {
            return cur
        }
        return 'Validado'
    })
    const [comentario, setComentario] = useState(() => documento.comentario || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        // Validar obligatoriedad de comentario para Rechazado o Incompleto
        if ((estado === 'Rechazado' || estado === 'Incompleto') && !comentario.trim()) {
            setErrorMessage(
                `Debe registrar una observación o causal detallada al marcar como "${
                    estado === 'Rechazado' ? 'Rechazado' : 'Incompleto'
                }".`
            )
            return
        }

        try {
            setIsSubmitting(true)
            const updated = await validarDocumento(documento.id_documento, {
                estado,
                comentario: comentario.trim(),
            })

            if (onValidated) {
                onValidated(updated)
            }
            onClose()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message)
            } else {
                setErrorMessage('Ocurrió un error al registrar el dictamen del documento.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-[#111827] border border-[#334155] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white space-y-0"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="p-5 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Scale className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">
                                Dictamen de Soporte Médico
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                Validación técnica según requerimientos de EPS / ARL
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                        title="Cerrar modal"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Tarjeta de Resumen del Documento */}
                    <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                    {documento.nombre}
                                </p>
                                <p className="text-[11px] text-[#94a3b8] capitalize">
                                    Tipo: {documento.tipo?.replace(/_/g, ' ')} • Formato: {documento.formato || 'PDF'}
                                </p>
                            </div>
                        </div>

                        {onPreview && (
                            <button
                                type="button"
                                onClick={() => onPreview(documento)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-cyan-400 border border-cyan-500/30 text-xs font-semibold shrink-0 transition cursor-pointer"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Ver</span>
                            </button>
                        )}
                    </div>

                    {/* Selector de los 3 Estados (Task 3.2.5) */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-[#cbd5e1]">
                            Decisión / Dictamen <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {/* Opción Validado / Aprobar */}
                            <button
                                type="button"
                                onClick={() => setEstado('Validado')}
                                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                                    estado === 'Validado'
                                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-[#1e293b]/60 border-[#334155] text-[#94a3b8] hover:border-emerald-500/40 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <CheckCircle2
                                        className={`h-4 w-4 ${
                                            estado === 'Validado' ? 'text-emerald-400' : 'text-[#64748b]'
                                        }`}
                                    />
                                    {estado === 'Validado' && (
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Aprobar</p>
                                    <p className="text-[10px] text-[#94a3b8] leading-tight">
                                        Conforme a normativa
                                    </p>
                                </div>
                            </button>

                            {/* Opción Incompleto / Solicitar Corrección */}
                            <button
                                type="button"
                                onClick={() => setEstado('Incompleto')}
                                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                                    estado === 'Incompleto'
                                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                                        : 'bg-[#1e293b]/60 border-[#334155] text-[#94a3b8] hover:border-amber-500/40 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <AlertTriangle
                                        className={`h-4 w-4 ${
                                            estado === 'Incompleto' ? 'text-amber-400' : 'text-[#64748b]'
                                        }`}
                                    />
                                    {estado === 'Incompleto' && (
                                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Solicitar Corrección</p>
                                    <p className="text-[10px] text-[#94a3b8] leading-tight">
                                        Requiere subsanar
                                    </p>
                                </div>
                            </button>

                            {/* Opción Rechazado */}
                            <button
                                type="button"
                                onClick={() => setEstado('Rechazado')}
                                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                                    estado === 'Rechazado'
                                        ? 'bg-red-500/15 border-red-500 text-white shadow-lg shadow-red-500/10'
                                        : 'bg-[#1e293b]/60 border-[#334155] text-[#94a3b8] hover:border-red-500/40 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <XCircle
                                        className={`h-4 w-4 ${
                                            estado === 'Rechazado' ? 'text-red-400' : 'text-[#64748b]'
                                        }`}
                                    />
                                    {estado === 'Rechazado' && (
                                        <span className="h-2 w-2 rounded-full bg-red-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Rechazar</p>
                                    <p className="text-[10px] text-[#94a3b8] leading-tight">
                                        Inválido o ilegible
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Observaciones / Justificación */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="comentario-validacion"
                                className="block text-xs font-semibold text-[#cbd5e1]"
                            >
                                Observaciones / Causal de Dictamen{' '}
                                {(estado === 'Rechazado' || estado === 'Incompleto') && (
                                    <span className="text-red-400">*</span>
                                )}
                            </label>
                            <span className="text-[10px] text-[#94a3b8]">
                                {estado === 'Validado' ? 'Opcional' : 'Obligatorio'}
                            </span>
                        </div>
                        <textarea
                            id="comentario-validacion"
                            rows={3}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder={
                                estado === 'Validado'
                                    ? 'Observaciones técnicas opcionales (ej: firma y sello verificados en EPS)...'
                                    : estado === 'Incompleto'
                                    ? 'Detalle qué páginas o información hacen falta para que el colaborador subsane (ej: falta historia clínica completa)...'
                                    : 'Indique la causal de rechazo (ej: documento ilegible, fecha anterior, no coincide paciente)...'
                            }
                            className="w-full px-3 py-2 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition"
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#334155]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#94a3b8] hover:text-white text-xs font-semibold transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                estado === 'Validado'
                                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                                    : estado === 'Incompleto'
                                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                                    : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <span>
                                    {estado === 'Validado'
                                        ? 'Aprobar Soporte'
                                        : estado === 'Incompleto'
                                        ? 'Solicitar Corrección'
                                        : 'Rechazar Soporte'}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function ModalValidarDocumento({
    isOpen,
    onClose,
    documento,
    onValidated,
    onPreview,
}: ModalValidarDocumentoProps) {
    if (!isOpen || !documento) return null

    return (
        <ModalValidarDocumentoForm
            key={`${documento.id_documento}-${documento.estado}`}
            documento={documento}
            onClose={onClose}
            onValidated={onValidated}
            onPreview={onPreview}
        />
    )
}

export default ModalValidarDocumento

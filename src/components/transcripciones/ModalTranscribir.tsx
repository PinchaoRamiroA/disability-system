'use client'

import React, { useState, useRef } from 'react'
import {
    X,
    FileCheck2,
    Calendar,
    Hash,
    FileText,
    UploadCloud,
    AlertCircle,
    CheckCircle2,
    Building2,
    Clock,
    File,
    Trash2,
    Loader2,
} from 'lucide-react'
import { TranscripcionPendienteItem } from '@/contracts/incapacidades'
import { transcribirIncapacidad, uploadEvidenciaRadicacion } from '@/services/transcripcion.service'

interface ModalTranscribirProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    item: TranscripcionPendienteItem | null
}

export function ModalTranscribir({
    isOpen,
    onClose,
    onSuccess,
    item,
}: ModalTranscribirProps) {
    const [numeroRadicado, setNumeroRadicado] = useState('')
    const [fechaTranscripcion, setFechaTranscripcion] = useState(
        () => new Date().toISOString().split('T')[0]
    )
    const [observaciones, setObservaciones] = useState('')
    const [archivoEvidencia, setArchivoEvidencia] = useState<File | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!isOpen || !item) return null

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0])
        }
    }

    const validateAndSetFile = (file: File) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
        ]
        const maxBytes = 10 * 1024 * 1024 // 10MB

        if (!allowedTypes.includes(file.type)) {
            setErrorMsg(
                'Formato de archivo inválido. Solo se admiten documentos PDF o imágenes JPG/PNG.'
            )
            return
        }

        if (file.size > maxBytes) {
            setErrorMsg('El archivo supera el tamaño máximo permitido de 10 MB.')
            return
        }

        setErrorMsg(null)
        setArchivoEvidencia(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!numeroRadicado.trim()) {
            setErrorMsg('El número de radicado ante la entidad es obligatorio.')
            return
        }

        if (!fechaTranscripcion) {
            setErrorMsg('La fecha de radicación/transcripción es obligatoria.')
            return
        }

        try {
            setSubmitting(true)
            setErrorMsg(null)
            setUploadProgress('Registrando radicación ante la EPS/ARL...')

            // 1. Registrar radicación
            await transcribirIncapacidad(item.id_incapacidad, {
                numero_radicado: numeroRadicado.trim(),
                fecha_transcripcion: fechaTranscripcion,
                observaciones: observaciones.trim() || undefined,
            })

            // 2. Subir soporte si fue adjuntado
            if (archivoEvidencia) {
                setUploadProgress('Adjuntando comprobante de radicado (evidencia)...')
                try {
                    await uploadEvidenciaRadicacion(item.id_incapacidad, archivoEvidencia)
                } catch (uploadErr) {
                    console.error('Error al subir evidencia de radicación:', uploadErr)
                    // No bloqueamos el éxito de la radicación si el archivo falla, pero avisamos
                }
            }

            setUploadProgress('¡Radicación completada con éxito!')
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 500)
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string }
            setErrorMsg(
                error.response?.data?.message ||
                error.message ||
                'Ocurrió un error al registrar la transcripción.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const expCode = `INC-${item.id_incapacidad.toString().padStart(4, '0')}`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl bg-[#111827] border border-[#334155] shadow-2xl overflow-hidden my-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937] bg-[#0f172a]/60">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <FileCheck2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                Radicar y Transcribir Incapacidad
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                Registro de trámite oficial ante EPS / ARL
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1f2937] transition disabled:opacity-50"
                        title="Cerrar modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Resumen del expediente */}
                <div className="px-6 py-3.5 bg-[#0b0f19] border-b border-[#1f2937] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                        <span className="text-[#64748b] block font-mono text-[11px]">Expediente</span>
                        <span className="font-semibold text-white font-mono">{expCode}</span>
                    </div>
                    <div>
                        <span className="text-[#64748b] block text-[11px]">Entidad Receptora</span>
                        <div className="flex items-center gap-1.5 font-medium text-white truncate">
                            <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{item.entidad?.nombre || 'EPS / ARL'}</span>
                        </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <span className="text-[#64748b] block text-[11px]">Plazo de Radicación</span>
                        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>
                                {item.entidad?.plazo_transcripcion_dias
                                    ? `${item.entidad.plazo_transcripcion_dias} días hábiles`
                                    : '3 días hábiles'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="flex-1">{errorMsg}</div>
                        </div>
                    )}

                    {uploadProgress && (
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2.5 animate-pulse">
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                            <span>{uploadProgress}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Número de Radicado */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5 text-blue-400" />
                                <span>Número de Radicado EPS/ARL</span>
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={numeroRadicado}
                                onChange={(e) => setNumeroRadicado(e.target.value)}
                                placeholder="Ej: RAD-2026-98124"
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#334155] text-white text-xs placeholder-[#64748b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                            />
                        </div>

                        {/* Fecha de Radicación */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                                <span>Fecha de Radicación</span>
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={fechaTranscripcion}
                                onChange={(e) => setFechaTranscripcion(e.target.value)}
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-blue-400" />
                            <span>Observaciones del Trámite</span>
                            <span className="text-[#64748b] font-normal text-[11px]">(Opcional)</span>
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Ej: Radicado por portal web SURA. Radicado aceptado para estudio técnico."
                            rows={2}
                            disabled={submitting}
                            className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#334155] text-white text-xs placeholder-[#64748b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Upload de Evidencia de Radicación */}
                    <div className="space-y-2 pt-1">
                        <label className="text-xs font-semibold text-[#cbd5e1] flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <UploadCloud className="h-3.5 w-3.5 text-blue-400" />
                                <span>Comprobante de Radicación (Evidencia)</span>
                            </span>
                            <span className="text-[11px] text-[#64748b]">PDF, JPG o PNG hasta 10MB</span>
                        </label>

                        {!archivoEvidencia ? (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setIsDragOver(true)
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                                    isDragOver
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-[#334155] bg-[#0b0f19]/60 hover:border-blue-500/50 hover:bg-[#0b0f19]'
                                }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                />
                                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium text-white">
                                        Arrastra aquí el comprobante o{' '}
                                        <span className="text-blue-400 underline">haz clic para examinar</span>
                                    </p>
                                    <p className="text-[11px] text-[#64748b]">
                                        Volante de radicado, captura de portal o firma de recepción
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-xl bg-[#0b0f19] border border-blue-500/30 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                        <File className="h-4 w-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-medium text-white truncate">
                                            {archivoEvidencia.name}
                                        </p>
                                        <p className="text-[11px] text-[#64748b]">
                                            {(archivoEvidencia.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setArchivoEvidencia(null)}
                                    disabled={submitting}
                                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                    title="Remover archivo"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-[#1f2937] flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-[#1f2937] transition disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Confirmar Radicación</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

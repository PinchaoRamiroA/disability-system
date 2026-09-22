'use client'

import React, { useState, useRef } from 'react'
import {
    RefreshCw,
    UploadCloud,
    FileText,
    Image as ImageIcon,
    X,
    AlertCircle,
    Loader2,
    CheckCircle2,
} from 'lucide-react'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import { reemplazarDocumento } from '@/services/documento.service'

interface ModalReemplazarDocumentoProps {
    isOpen: boolean
    onClose: () => void
    documento: IncapacidadDocumento | null
    onReplaced?: (newDoc: IncapacidadDocumento) => void
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function ModalReemplazarDocumentoForm({
    documento,
    onClose,
    onReplaced,
}: {
    documento: IncapacidadDocumento
    onClose: () => void
    onReplaced?: (newDoc: IncapacidadDocumento) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const validateFile = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return `El archivo supera el tamaño máximo permitido de 10 MB (${formatBytes(
                file.size
            )}).`
        }
        const ext = '.' + file.name.split('.').pop()?.toLowerCase()
        const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())
        const isExtValid = ALLOWED_EXTENSIONS.includes(ext)

        if (!isMimeValid && !isExtValid) {
            return 'Formato no permitido. Solo se aceptan archivos PDF, JPG o PNG.'
        }
        return null
    }

    const handleFileSelected = (file: File) => {
        setErrorMessage(null)
        const error = validateFile(file)
        if (error) {
            setErrorMessage(error)
            setSelectedFile(null)
            return
        }
        setSelectedFile(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) {
            setErrorMessage('Por favor seleccione un nuevo archivo para sustituir el soporte.')
            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage(null)

            const nuevoDoc = await reemplazarDocumento(
                documento.id_incapacidad,
                documento.id_documento,
                selectedFile,
                documento.tipo
            )

            if (onReplaced) {
                onReplaced(nuevoDoc)
            }
            onClose()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message)
            } else {
                setErrorMessage('Error al reemplazar el documento.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const isPdf =
        selectedFile?.type === 'application/pdf' ||
        selectedFile?.name.toLowerCase().endsWith('.pdf')

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
                            <RefreshCw className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">
                                Reemplazar Soporte Documental
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                Sube una nueva versión corregida manteniendo el histórico
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

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Soporte Actual */}
                    <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider block">
                            Archivo a sustituir:
                        </span>
                        <div className="flex items-center gap-2.5">
                            <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                    {documento.nombre}
                                </p>
                                <p className="text-[10px] text-[#94a3b8] capitalize">
                                    Tipo: {documento.tipo?.replace(/_/g, ' ')} • Estado: {documento.estado || 'Pendiente'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dropzone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                            isDragOver
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-[#334155] bg-[#0f172a]/60 hover:border-blue-500/50 hover:bg-[#1e293b]/40'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileSelected(e.target.files[0])
                                }
                            }}
                        />

                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                            <UploadCloud className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white">
                                Arrastra el nuevo archivo aquí o haz clic para explorar
                            </p>
                            <p className="text-[11px] text-[#94a3b8] mt-0.5">
                                Formatos permitidos: PDF, JPG, PNG (Hasta 10 MB)
                            </p>
                        </div>
                    </div>

                    {/* Archivo Seleccionado */}
                    {selectedFile && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {isPdf ? (
                                    <FileText className="h-5 w-5 text-emerald-400 shrink-0" />
                                ) : (
                                    <ImageIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-[10px] text-emerald-400">
                                        Nuevo archivo • {formatBytes(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedFile(null)
                                }}
                                className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition cursor-pointer"
                                title="Quitar archivo"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Mensaje de Error */}
                    {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
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
                            disabled={isSubmitting || !selectedFile}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Subiendo y reemplazando...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Confirmar Reemplazo</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function ModalReemplazarDocumento({
    isOpen,
    onClose,
    documento,
    onReplaced,
}: ModalReemplazarDocumentoProps) {
    if (!isOpen || !documento) return null

    return (
        <ModalReemplazarDocumentoForm
            key={`${documento.id_documento}-${documento.nombre}`}
            documento={documento}
            onClose={onClose}
            onReplaced={onReplaced}
        />
    )
}

export default ModalReemplazarDocumento

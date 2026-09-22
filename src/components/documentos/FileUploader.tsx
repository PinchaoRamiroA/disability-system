'use client'

import React, { useState, useRef, useMemo } from 'react'
import {
    UploadCloud,
    FileText,
    Image as ImageIcon,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowUpCircle,
} from 'lucide-react'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import type { TipoDocumento } from '@/contracts/catalogos'
import { uploadDocumento } from '@/services/documento.service'

interface FileUploaderProps {
    incapacidadId: number | string
    availableTipos?: (string | TipoDocumento)[]
    defaultTipo?: string
    onSuccess?: (nuevoDoc: IncapacidadDocumento) => void
    onCancel?: () => void
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

export function FileUploader({
    incapacidadId,
    availableTipos = [],
    defaultTipo = '',
    onSuccess,
    onCancel,
}: FileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Normalizar lista de tipos
    const tiposList = useMemo(() => {
        if (!availableTipos || availableTipos.length === 0) {
            return [
                { id: 'certificado_incapacidad', label: 'Certificado de Incapacidad Médica' },
                { id: 'historia_clinica', label: 'Historia Clínica / Epicrisis' },
                { id: 'furips', label: 'FURIPS (Accidente de Tránsito)' },
                { id: 'soporte_pago', label: 'Soporte o Comprobante de Pago' },
                { id: 'concepto_rehabilitacion', label: 'Concepto de Rehabilitación' },
                { id: 'registro_civil', label: 'Registro Civil / Nacido Vivo' },
            ]
        }

        return availableTipos.map((item) => {
            if (typeof item === 'string') {
                return {
                    id: item,
                    label: item.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                }
            }
            return {
                id: item.nombre.toLowerCase().replace(/\s+/g, '_'),
                label: item.nombre,
            }
        })
    }, [availableTipos])

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedTipo, setSelectedTipo] = useState<string>(
        defaultTipo || (tiposList.length > 0 ? tiposList[0].id : 'certificado_incapacidad')
    )
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Validar archivo seleccionado
    const validateFile = (file: File): boolean => {
        setError(null)

        // Validar tamaño máximo
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(
                `El archivo excede el tamaño máximo permitido de 10 MB (Tamaño actual: ${formatBytes(file.size)}).`
            )
            return false
        }

        // Validar extensión
        const ext = '.' + file.name.split('.').pop()?.toLowerCase()
        const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext)
        const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type)

        if (!isAllowedExt && !isAllowedMime) {
            setError(
                'Formato no permitido. Solo se aceptan documentos en PDF o imágenes JPG y PNG.'
            )
            return false
        }

        return true
    }

    const handleFileSelected = (file: File) => {
        if (validateFile(file)) {
            setSelectedFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0])
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelected(e.target.files[0])
        }
    }

    const handleClearFile = () => {
        setSelectedFile(null)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmitUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) {
            setError('Por favor, selecciona o arrastra un archivo para cargar.')
            return
        }
        if (!selectedTipo) {
            setError('Por favor, selecciona el tipo de soporte documental.')
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const nuevoDoc = await uploadDocumento(incapacidadId, selectedFile, selectedTipo)
            handleClearFile()
            if (onSuccess) {
                onSuccess(nuevoDoc)
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Error al subir el documento. Por favor, intenta de nuevo.')
            }
        } finally {
            setIsUploading(false)
        }
    }

    const isPdf = selectedFile?.name.toLowerCase().endsWith('.pdf')

    return (
        <form onSubmit={handleSubmitUpload} className="space-y-4">
            {/* Error Banner */}
            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                    <div className="space-y-0.5">
                        <span className="font-semibold block">Error de validación</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Selector de Tipo de Documento */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#cbd5e1] block">
                    Tipo de Soporte Médico <span className="text-red-400">*</span>
                </label>
                <select
                    value={selectedTipo}
                    onChange={(e) => {
                        setSelectedTipo(e.target.value)
                        setError(null)
                    }}
                    required
                    disabled={isUploading}
                    className="w-full px-3 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                >
                    {tiposList.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Drag and Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
                    isDragging
                        ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                        : selectedFile
                        ? 'border-[#334155] bg-[#0f172a]/60'
                        : 'border-[#334155] bg-[#0f172a] hover:border-blue-500/60 hover:bg-[#111827] cursor-pointer'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={isUploading}
                />

                {!selectedFile ? (
                    <div className="space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                            <UploadCloud className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">
                                Arrastra y suelta tu archivo aquí
                            </p>
                            <p className="text-xs text-[#94a3b8]">
                                o haz clic para examinar desde tu equipo
                            </p>
                        </div>
                        <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#64748b]">
                            <span className="px-2 py-0.5 rounded bg-[#1e293b] border border-[#334155]">
                                PDF
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#1e293b] border border-[#334155]">
                                JPG / JPEG
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#1e293b] border border-[#334155]">
                                PNG
                            </span>
                            <span>Máx. 10 MB</span>
                        </div>
                    </div>
                ) : (
                    /* Tarjeta de Archivo Seleccionado */
                    <div className="p-4 rounded-xl bg-[#111827] border border-[#334155] flex items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
                                    isPdf
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                }`}
                            >
                                {isPdf ? (
                                    <FileText className="h-5 w-5" />
                                ) : (
                                    <ImageIcon className="h-5 w-5" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                    {selectedFile.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#94a3b8]">
                                    <span>{formatBytes(selectedFile.size)}</span>
                                    <span>•</span>
                                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Listo para subir
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClearFile()
                            }}
                            disabled={isUploading}
                            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition disabled:opacity-50 cursor-pointer"
                            title="Descartar archivo"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isUploading}
                        className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white border border-[#334155] transition disabled:opacity-50 cursor-pointer"
                    >
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Cargando soporte...</span>
                        </>
                    ) : (
                        <>
                            <ArrowUpCircle className="h-4 w-4" />
                            <span>Subir Documento</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default FileUploader

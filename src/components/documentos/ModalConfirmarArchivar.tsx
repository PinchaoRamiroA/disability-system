'use client'

import React, { useState } from 'react'
import {
    Archive,
    AlertTriangle,
    FileText,
    X,
    Loader2,
} from 'lucide-react'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import { deleteDocumento } from '@/services/documento.service'

interface ModalConfirmarArchivarProps {
    isOpen: boolean
    onClose: () => void
    documento: IncapacidadDocumento | null
    onArchived?: (archivedDocId: number) => void
}

export function ModalConfirmarArchivar({
    isOpen,
    onClose,
    documento,
    onArchived,
}: ModalConfirmarArchivarProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    if (!isOpen || !documento) return null

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true)
            setErrorMessage(null)

            await deleteDocumento(documento.id_documento)

            if (onArchived) {
                onArchived(documento.id_documento)
            }
            onClose()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message)
            } else {
                setErrorMessage('Error al archivar el soporte documental.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-[#111827] border border-[#334155] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-white space-y-0"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="p-5 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                            <Archive className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">
                                Archivar Documento
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                El soporte pasará al archivo histórico digital
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

                {/* Content */}
                <div className="p-5 space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            ¿Está seguro de archivar este soporte? Dejará de figurar en la auditoría activa del expediente, pero se conservará la trazabilidad en la bitácora histórica.
                        </p>
                    </div>

                    {/* Resumen del Documento */}
                    <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider block">
                            Documento a archivar:
                        </span>
                        <div className="flex items-center gap-2.5">
                            <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                    {documento.nombre}
                                </p>
                                <p className="text-[10px] text-[#94a3b8] capitalize">
                                    Tipo: {documento.tipo?.replace(/_/g, ' ')} • Formato: {documento.formato || 'PDF'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de Error */}
                    {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                            {errorMessage}
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
                            type="button"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/20 transition cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Archivando...</span>
                                </>
                            ) : (
                                <>
                                    <Archive className="h-3.5 w-3.5" />
                                    <span>Confirmar y Archivar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalConfirmarArchivar

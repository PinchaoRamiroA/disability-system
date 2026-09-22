'use client'

import React, { useEffect } from 'react'
import {
    X,
    Download,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Calendar,
    Info,
} from 'lucide-react'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface DocumentPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    documento: IncapacidadDocumento | null
}

export function DocumentPreviewModal({
    isOpen,
    onClose,
    documento,
}: DocumentPreviewModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen || !documento) return null

    const formatoLower = (documento.formato || documento.nombre || '').toLowerCase()
    const isPdf = formatoLower.endsWith('.pdf') || formatoLower === 'pdf'
    const isImage =
        formatoLower.endsWith('.jpg') ||
        formatoLower.endsWith('.jpeg') ||
        formatoLower.endsWith('.png') ||
        formatoLower === 'jpg' ||
        formatoLower === 'jpeg' ||
        formatoLower === 'png'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="w-full max-w-4xl max-h-[92vh] bg-[#111827] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0b1324] shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                isPdf
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            }`}
                        >
                            {isPdf ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-white truncate">
                                {documento.nombre}
                            </h2>
                            <p className="text-[11px] text-[#94a3b8] capitalize">
                                {documento.tipo?.replace(/_/g, ' ')} • ID #{documento.id_documento}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {documento.url && (
                            <a
                                href={documento.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-[#94a3b8] hover:text-white border border-[#334155] transition text-xs flex items-center gap-1.5"
                                title="Abrir en pestaña nueva"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                        {documento.url && (
                            <a
                                href={documento.url}
                                download={documento.nombre}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                                title="Descargar archivo original"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Descargar</span>
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                            title="Cerrar visor"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Body: Preview Viewer */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#0f172a] flex items-center justify-center min-h-[350px]">
                    {isPdf && documento.url ? (
                        <div className="w-full h-[60vh] rounded-xl overflow-hidden border border-[#334155] bg-[#1e293b]/40">
                            <iframe
                                src={`${documento.url}#toolbar=0`}
                                title={documento.nombre}
                                className="w-full h-full rounded-xl"
                            />
                        </div>
                    ) : isImage && documento.url ? (
                        <div className="max-h-[60vh] max-w-full flex items-center justify-center rounded-xl overflow-hidden bg-black/40 border border-[#334155] p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={documento.url}
                                alt={documento.nombre}
                                className="max-h-[58vh] max-w-full object-contain rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="p-8 text-center rounded-xl bg-[#111827] border border-[#334155] space-y-3">
                            <Info className="h-10 w-10 text-[#64748b] mx-auto" />
                            <p className="text-sm font-medium text-white">
                                Vista previa no disponible para este formato.
                            </p>
                            <p className="text-xs text-[#94a3b8]">
                                Puedes descargar el archivo original para revisarlo en tu dispositivo.
                            </p>
                            {documento.url && (
                                <a
                                    href={documento.url}
                                    download={documento.nombre}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Descargar {documento.nombre}</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Metadata */}
                <div className="px-6 py-3.5 border-t border-[#334155] bg-[#0b1324] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={documento.estado || 'Pendiente'} />

                        {documento.fecha_carga && (
                            <span className="text-[#94a3b8] flex items-center gap-1.5 text-[11px]">
                                <Calendar className="h-3.5 w-3.5 text-[#64748b]" />
                                Cargado el: {documento.fecha_carga}
                            </span>
                        )}

                        {documento.validado_por && (
                            <span className="text-cyan-400 text-[11px]">
                                Validado por gestor #{documento.validado_por}
                            </span>
                        )}
                    </div>

                    {documento.comentario && (
                        <div className="text-[11px] text-amber-400/90 italic bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                            Nota de auditoría: {documento.comentario}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocumentPreviewModal

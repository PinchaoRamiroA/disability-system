'use client'

import React, { useMemo } from 'react'
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    XCircle,
    FileCheck2,
    Upload,
} from 'lucide-react'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import type { TipoDocumento } from '@/contracts/catalogos'

interface DocumentChecklistProps {
    requiredTipos: (string | TipoDocumento)[]
    uploadedDocs: IncapacidadDocumento[]
    onQuickUpload?: (tipo: string) => void
}

type RequirementStatus = 'validado' | 'pendiente' | 'rechazado' | 'faltante'

interface ChecklistItem {
    key: string
    title: string
    status: RequirementStatus
    doc?: IncapacidadDocumento
}

function normalizeKey(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[\s\-_]+/g, '')
}

export function DocumentChecklist({
    requiredTipos,
    uploadedDocs,
    onQuickUpload,
}: DocumentChecklistProps) {
    const checklistItems = useMemo<ChecklistItem[]>(() => {
        return requiredTipos.map((item) => {
            const key = typeof item === 'string' ? item : item.nombre
            const title =
                typeof item === 'string'
                    ? item.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                    : item.nombre

            const normReq = normalizeKey(key)

            // Buscar en documentos cargados
            const matchingDoc = uploadedDocs.find((doc) => {
                const normDocTipo = normalizeKey(doc.tipo)
                const normDocName = normalizeKey(doc.nombre)
                return normDocTipo.includes(normReq) || normReq.includes(normDocTipo) || normDocName.includes(normReq)
            })

            let status: RequirementStatus = 'faltante'
            if (matchingDoc) {
                const estado = (matchingDoc.estado || '').toLowerCase()
                if (estado.includes('valid')) {
                    status = 'validado'
                } else if (estado.includes('rechaz') || estado.includes('inval')) {
                    status = 'rechazado'
                } else {
                    status = 'pendiente'
                }
            }

            return {
                key,
                title,
                status,
                doc: matchingDoc,
            }
        })
    }, [requiredTipos, uploadedDocs])

    // Estadísticas de completitud
    const totalRequired = checklistItems.length
    const completedCount = checklistItems.filter(
        (item) => item.status === 'validado' || item.status === 'pendiente'
    ).length
    const percentage =
        totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 100

    const isFullyCompliant = totalRequired > 0 && completedCount === totalRequired

    return (
        <div className="rounded-2xl bg-[#0f172a] border border-[#334155] p-5 space-y-4">
            {/* Header del Checklist */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]/60">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-white">
                            Checklist de Cumplimiento Documental
                        </h3>
                        <p className="text-[11px] text-[#94a3b8]">
                            Soportes obligatorios exigidos según el tipo de incapacidad médica
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            isFullyCompliant
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                    >
                        {completedCount} de {totalRequired} Soportes ({percentage}%)
                    </span>
                </div>
            </div>

            {/* Barra de Progreso */}
            <div className="space-y-1.5">
                <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 rounded-full ${
                            isFullyCompliant
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-amber-500 to-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Grid de Ítems Requeridos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {checklistItems.map((item) => {
                    const isVal = item.status === 'validado'
                    const isPend = item.status === 'pendiente'
                    const isRech = item.status === 'rechazado'
                    const isFalt = item.status === 'faltante'

                    return (
                        <div
                            key={item.key}
                            className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                                isVal
                                    ? 'bg-emerald-500/5 border-emerald-500/30'
                                    : isPend
                                    ? 'bg-amber-500/5 border-amber-500/30'
                                    : isRech
                                    ? 'bg-red-500/5 border-red-500/30'
                                    : 'bg-[#111827] border-[#334155]'
                            }`}
                        >
                            <div className="flex items-start gap-2.5 min-w-0">
                                <div className="mt-0.5 shrink-0">
                                    {isVal && (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    )}
                                    {isPend && <Clock className="h-4 w-4 text-amber-400" />}
                                    {isRech && <XCircle className="h-4 w-4 text-red-400" />}
                                    {isFalt && (
                                        <AlertTriangle className="h-4 w-4 text-[#64748b]" />
                                    )}
                                </div>

                                <div className="min-w-0 space-y-0.5">
                                    <p className="text-xs font-semibold text-white truncate">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[10px]">
                                        {isVal && (
                                            <span className="text-emerald-400 font-medium">
                                                ✅ Validado
                                            </span>
                                        )}
                                        {isPend && (
                                            <span className="text-amber-400 font-medium">
                                                ⏳ En Revisión
                                            </span>
                                        )}
                                        {isRech && (
                                            <span className="text-red-400 font-medium">
                                                ❌ Rechazado
                                            </span>
                                        )}
                                        {isFalt && (
                                            <span className="text-[#94a3b8]">
                                                ⚠️ Pendiente de carga
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Botón rápido de adjuntar para faltantes o rechazados */}
                            {(isFalt || isRech) && onQuickUpload && (
                                <button
                                    type="button"
                                    onClick={() => onQuickUpload(item.key)}
                                    className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 transition shrink-0 cursor-pointer"
                                    title={`Adjuntar ${item.title}`}
                                >
                                    <Upload className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DocumentChecklist

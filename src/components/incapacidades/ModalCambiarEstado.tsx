'use client'

import React, { useState } from 'react'
import { X, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import type { Incapacidad, Estado } from '@/contracts/incapacidades'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { incapacidadService } from '@/services/incapacidad.service'

interface ModalCambiarEstadoProps {
    isOpen: boolean
    onClose: () => void
    incapacidad: Incapacidad | null
    estados: Estado[]
    onSuccess: () => void
}

export function ModalCambiarEstado({
    isOpen,
    onClose,
    incapacidad,
    estados,
    onSuccess,
}: ModalCambiarEstadoProps) {
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | ''>('')
    const [observaciones, setObservaciones] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleClose = () => {
        setSelectedEstadoId('')
        setObservaciones('')
        setError(null)
        onClose()
    }

    if (!isOpen || !incapacidad) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEstadoId) {
            setError('Por favor, selecciona el nuevo estado.')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            await incapacidadService.cambiarEstado(incapacidad.id_incapacidad, {
                id_estado: Number(selectedEstadoId),
                observaciones: observaciones.trim() || undefined,
            })
            onSuccess()
            onClose()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('No fue posible actualizar el estado. Intenta de nuevo.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const currentEstadoId = incapacidad.estado?.id_estado

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="w-full max-w-lg bg-[#111827] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0b1324]">
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Cambiar Estado de Incapacidad
                        </h2>
                        <p className="text-xs text-[#94a3b8] mt-0.5">
                            ID #{incapacidad.id_incapacidad} - {incapacidad.titulo}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Banner */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Current State vs New State indicator */}
                    <div className="p-4 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] font-medium text-[#94a3b8] block">
                                Estado Actual
                            </span>
                            <StatusBadge status={incapacidad.estado?.nombre || 'Recibida'} />
                        </div>

                        <ArrowRight className="h-4 w-4 text-[#64748b]" />

                        <div className="space-y-1 text-right">
                            <span className="text-[11px] font-medium text-[#94a3b8] block">
                                Nuevo Estado
                            </span>
                            {selectedEstadoId ? (
                                <StatusBadge
                                    status={
                                        estados.find((e) => e.id_estado === Number(selectedEstadoId))
                                            ?.nombre
                                    }
                                />
                            ) : (
                                <span className="text-xs text-[#64748b] italic">Sin seleccionar</span>
                            )}
                        </div>
                    </div>

                    {/* Estado Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#cbd5e1]">
                            Seleccionar Nuevo Estado <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={selectedEstadoId}
                            onChange={(e) => {
                                setSelectedEstadoId(e.target.value ? Number(e.target.value) : '')
                                setError(null)
                            }}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition"
                        >
                            <option value="">-- Selecciona el nuevo estado --</option>
                            {estados.map((est) => (
                                <option
                                    key={est.id_estado}
                                    value={est.id_estado}
                                    disabled={est.id_estado === currentEstadoId}
                                >
                                    {est.nombre} {est.id_estado === currentEstadoId ? '(Actual)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#cbd5e1]">
                            Motivo / Observaciones del Cambio
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={3}
                            disabled={isLoading}
                            placeholder="Ej. Radicado ante la EPS SURA con acta #49120. En espera de auditoría médica..."
                            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#334155] flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white border border-[#334155] transition disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !selectedEstadoId}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            <span>Guardar Estado</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalCambiarEstado

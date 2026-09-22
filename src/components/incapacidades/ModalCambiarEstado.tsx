'use client'

import React, { useState, useMemo } from 'react'
import {
    X,
    ArrowRight,
    ArrowLeft,
    Loader2,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    HelpCircle,
} from 'lucide-react'
import type { Incapacidad, Estado } from '@/contracts/incapacidades'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { incapacidadService } from '@/services/incapacidad.service'
import { useAuth } from '@/hooks/useAuth'

interface ModalCambiarEstadoProps {
    isOpen: boolean
    onClose: () => void
    incapacidad: Incapacidad | null
    estados: Estado[]
    onSuccess: (nuevoEstadoNombre: string) => void
}

/**
 * Mapa de transiciones legales válidas según docs/business/medical-leaves-flow.md
 * y validación backend en VerificarEstadoTransicion.
 */
const VALID_FORWARD_TRANSITIONS: Record<string, string[]> = {
    'Recibida': ['En validación documental', 'Pendiente transcripción', 'Documentación incompleta'],
    'En validación documental': ['Documentación incompleta', 'Pendiente transcripción'],
    'Documentación incompleta': ['En validación documental', 'Pendiente transcripción'],
    'Pendiente transcripción': ['Transcrita'],
    'Transcrita': ['En verificación EPS'],
    'En verificación EPS': ['Aprobada'],
    'Aprobada': ['Cobrada'],
    'Cobrada': ['Pendiente pago'],
    'Pendiente pago': ['Pagada', 'Cobro persuasivo', 'Cobro jurídico'],
    'Pagada': ['En conciliación'],
    'En conciliación': ['Conciliada'],
    'Conciliada': ['Cerrada'],
    'Cobro persuasivo': ['Cobro jurídico', 'Pagada'],
    'Cobro jurídico': ['Pagada'],
}

const UNIVERSAL_TERMINAL_STATES = ['Rechazada', 'Archivada', 'Cerrada']

type Step = 'FORM' | 'CONFIRM'

export function ModalCambiarEstado({
    isOpen,
    onClose,
    incapacidad,
    estados,
    onSuccess,
}: ModalCambiarEstadoProps) {
    const { user, isAdmin, hasPermission } = useAuth()

    const [currentStep, setCurrentStep] = useState<Step>('FORM')
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | ''>('')
    const [observaciones, setObservaciones] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleClose = () => {
        if (isLoading) return
        setSelectedEstadoId('')
        setObservaciones('')
        setError(null)
        setCurrentStep('FORM')
        onClose()
    }

    const currentEstadoNombre = incapacidad?.estado?.nombre || 'Recibida'
    const currentEstadoPermiteTransicion = incapacidad?.estado?.permite_transicion ?? true

    // Identificar el objeto del nuevo estado seleccionado
    const selectedEstado = useMemo(() => {
        if (!selectedEstadoId) return null
        return estados.find((e) => e.id_estado === Number(selectedEstadoId)) || null
    }, [selectedEstadoId, estados])

    // Determinar transiciones válidas hacia adelante
    const forwardStates = useMemo(() => {
        const allowedNames = VALID_FORWARD_TRANSITIONS[currentEstadoNombre] || []
        return estados.filter((e) => allowedNames.includes(e.nombre))
    }, [currentEstadoNombre, estados])

    // Estados de excepción o cierre
    const terminalStates = useMemo(() => {
        return estados.filter((e) => UNIVERSAL_TERMINAL_STATES.includes(e.nombre))
    }, [estados])

    // Otros estados no estándar para la etapa actual
    const otherStates = useMemo(() => {
        const forwardNames = VALID_FORWARD_TRANSITIONS[currentEstadoNombre] || []
        return estados.filter(
            (e) =>
                e.nombre !== currentEstadoNombre &&
                !forwardNames.includes(e.nombre) &&
                !UNIVERSAL_TERMINAL_STATES.includes(e.nombre)
        )
    }, [currentEstadoNombre, estados])

    // Placeholder contextual según el estado seleccionado
    const placeholderText = useMemo(() => {
        if (!selectedEstado) {
            return 'Ej: Radicación formal efectuada, revisión de antecedentes médicos...'
        }
        const name = selectedEstado.nombre.toLowerCase()
        if (name.includes('incompleta')) {
            return 'Detalla cuáles soportes hacen falta (ej: Furips firmado, epicrisis hospitalaria)...'
        }
        if (name.includes('rechazada')) {
            return 'Indica la causal de rechazo según auditoría o la respuesta de la EPS/ARL...'
        }
        if (name.includes('transcrita')) {
            return 'Indica el número de radicado oficial ante la EPS y fecha estimada de cobro...'
        }
        if (name.includes('pagada') || name.includes('cobrada')) {
            return 'Indica número de comprobante, liquidación de la entidad o valor liquidado...'
        }
        if (name.includes('jurídico') || name.includes('persuasivo')) {
            return 'Detalla la acción de cobro emprendida, oficio remitido y gestor jurídico asignado...'
        }
        return 'Indica los motivos u observaciones relevantes de este cambio de estado...'
    }, [selectedEstado])

    // Requiere observaciones obligatorias para ciertos estados críticos
    const isObservacionesRequired = useMemo(() => {
        if (!selectedEstado) return false
        const name = selectedEstado.nombre.toLowerCase()
        return name.includes('rechazada') || name.includes('incompleta') || name.includes('archivada')
    }, [selectedEstado])

    // Verificar si el usuario tiene permiso para archivar si selecciona 'Archivada'
    const canArchive = useMemo(() => {
        return isAdmin || hasPermission('archivar_incapacidad')
    }, [isAdmin, hasPermission])

    // Validación antes de pasar a la pantalla de confirmación
    const handleProceedToConfirm = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!selectedEstadoId || !selectedEstado) {
            setError('Por favor, selecciona el nuevo estado para continuar.')
            return
        }

        if (selectedEstado.nombre === 'Archivada' && !canArchive) {
            setError('No tienes permiso para archivar incapacidades.')
            return
        }

        if (isObservacionesRequired && !observaciones.trim()) {
            setError(`Las observaciones son obligatorias al pasar al estado "${selectedEstado.nombre}".`)
            return
        }

        setCurrentStep('CONFIRM')
    }

    // Envío definitivo de la actualización (Task 2.4.1)
    const handleConfirmSubmit = async () => {
        if (!incapacidad || !selectedEstado) return

        setIsLoading(true)
        setError(null)

        try {
            await incapacidadService.cambiarEstado(incapacidad.id_incapacidad, {
                id_estado: selectedEstado.id_estado,
                observaciones: observaciones.trim() || undefined,
            })

            const nuevoNombre = selectedEstado.nombre
            handleClose()
            onSuccess(nuevoNombre)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('No fue posible actualizar el estado. Por favor, verifica e intenta nuevamente.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen || !incapacidad) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="w-full max-w-lg bg-[#111827] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0b1324]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {currentStep === 'FORM' ? 'Paso 1 de 2' : 'Paso 2 de 2'}
                            </span>
                            <h2 className="text-sm font-semibold text-white">
                                {currentStep === 'FORM'
                                    ? 'Cambiar Estado de Incapacidad'
                                    : 'Confirmar Cambio de Estado'}
                            </h2>
                        </div>
                        <p className="text-xs text-[#94a3b8] mt-0.5">
                            Expediente #{incapacidad.id_incapacidad} • {incapacidad.titulo}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition disabled:opacity-50 cursor-pointer"
                        title="Cerrar modal"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                        <div className="space-y-0.5">
                            <span className="font-semibold block">Atención</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Estado cerrado / no permite transición */}
                {!currentEstadoPermiteTransicion && (
                    <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                            <span className="font-semibold block">Estado Final</span>
                            <span>
                                La incapacidad se encuentra en el estado <strong>{currentEstadoNombre}</strong>, el cual es terminal y no admite más transiciones en el flujo operativo.
                            </span>
                        </div>
                    </div>
                )}

                {/* Step 1: Formulario de Selección y Observaciones */}
                {currentStep === 'FORM' && (
                    <form onSubmit={handleProceedToConfirm} className="p-6 space-y-4">
                        {/* Estado Actual vs Nuevo Estado Preview */}
                        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#94a3b8] block">
                                    Estado Actual
                                </span>
                                <StatusBadge status={currentEstadoNombre} />
                            </div>

                            <div className="flex flex-col items-center px-2">
                                <ArrowRight className="h-4 w-4 text-blue-400" />
                            </div>

                            <div className="space-y-1 text-right">
                                <span className="text-[11px] font-medium text-[#94a3b8] block">
                                    Nuevo Estado
                                </span>
                                {selectedEstado ? (
                                    <StatusBadge status={selectedEstado.nombre} />
                                ) : (
                                    <span className="text-xs text-[#64748b] italic">Sin seleccionar</span>
                                )}
                            </div>
                        </div>

                        {/* Selector de Nuevo Estado */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#cbd5e1] flex items-center justify-between">
                                <span>
                                    Seleccionar Nuevo Estado <span className="text-red-400">*</span>
                                </span>
                                <span className="text-[11px] text-[#94a3b8] font-normal">
                                    Basado en ciclo legal
                                </span>
                            </label>

                            <select
                                value={selectedEstadoId}
                                onChange={(e) => {
                                    setSelectedEstadoId(e.target.value ? Number(e.target.value) : '')
                                    setError(null)
                                }}
                                required
                                disabled={isLoading || !currentEstadoPermiteTransicion}
                                className="w-full px-3 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                            >
                                <option value="">-- Selecciona el nuevo estado --</option>

                                {forwardStates.length > 0 && (
                                    <optgroup label="Siguientes Pasos Recomendados">
                                        {forwardStates.map((est) => (
                                            <option key={est.id_estado} value={est.id_estado}>
                                                ➜ {est.nombre}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {terminalStates.length > 0 && (
                                    <optgroup label="Estados de Cierre / Excepción">
                                        {terminalStates.map((est) => (
                                            <option
                                                key={est.id_estado}
                                                value={est.id_estado}
                                                disabled={est.nombre === currentEstadoNombre}
                                            >
                                                ⚠ {est.nombre}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {otherStates.length > 0 && (
                                    <optgroup label="Otras Transiciones (No estándar en esta fase)">
                                        {otherStates.map((est) => (
                                            <option key={est.id_estado} value={est.id_estado}>
                                                {est.nombre}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>

                        {/* Observaciones (Task 2.4.3) */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                                    <span>Motivo / Observaciones del Cambio</span>
                                    {isObservacionesRequired ? (
                                        <span className="text-red-400 text-[11px] font-bold">
                                            (Requerido)
                                        </span>
                                    ) : (
                                        <span className="text-[#94a3b8] text-[11px] font-normal">
                                            (Recomendado)
                                        </span>
                                    )}
                                </label>
                                <span className="text-[10px] text-[#64748b]">
                                    {observaciones.length} / 500
                                </span>
                            </div>

                            <textarea
                                value={observaciones}
                                onChange={(e) => {
                                    setObservaciones(e.target.value.slice(0, 500))
                                    if (error) setError(null)
                                }}
                                rows={3}
                                disabled={isLoading || !currentEstadoPermiteTransicion}
                                placeholder={placeholderText}
                                className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition resize-none"
                            />
                        </div>

                        {/* Botones Paso 1 */}
                        <div className="pt-3 border-t border-[#334155] flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white border border-[#334155] transition disabled:opacity-50 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !selectedEstadoId || !currentEstadoPermiteTransicion}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <span>Continuar</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Modal de Confirmación Explícita (Task 2.4.2) */}
                {currentStep === 'CONFIRM' && selectedEstado && (
                    <div className="p-6 space-y-4">
                        {/* Tarjeta de Transición */}
                        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
                            <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                                Resumen de Transición
                            </span>
                            <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#64748b] block font-medium">
                                        De:
                                    </span>
                                    <StatusBadge status={currentEstadoNombre} />
                                </div>
                                <ArrowRight className="h-5 w-5 text-blue-400 shrink-0" />
                                <div className="space-y-1 text-right">
                                    <span className="text-[10px] text-[#64748b] block font-medium">
                                        Hacia:
                                    </span>
                                    <StatusBadge status={selectedEstado.nombre} />
                                </div>
                            </div>
                        </div>

                        {/* Alerta de Estado Especial */}
                        {selectedEstado.nombre === 'Rechazada' && (
                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                                <div>
                                    <span className="font-semibold block">Incapacidad Rechazada</span>
                                    <span>
                                        Al pasar a este estado, se suspenden los cobros ante la EPS y el trámite se marcará como rechazado permanentemente.
                                    </span>
                                </div>
                            </div>
                        )}

                        {selectedEstado.nombre === 'Archivada' && (
                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2.5">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                                <div>
                                    <span className="font-semibold block">Expediente Archivado</span>
                                    <span>
                                        El expediente se retirará del flujo activo de radicación y cobros.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Auditoría y Gestor Responsable */}
                        <div className="p-3.5 rounded-xl bg-[#1e293b]/60 border border-[#334155] space-y-2 text-xs">
                            <div className="flex justify-between items-center text-[#cbd5e1]">
                                <span className="text-[#94a3b8]">Gestor responsable:</span>
                                <span className="font-medium text-white">
                                    {user?.nombre || user?.correo || 'Usuario Actual'} ({user?.rol?.nombre || 'Gestor'})
                                </span>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-[#334155]/60">
                                <span className="text-[#94a3b8] block">Observaciones registradas:</span>
                                <p className="text-white bg-[#0f172a] p-2.5 rounded-lg border border-[#334155] italic text-[11px] leading-relaxed">
                                    {observaciones.trim() || 'Sin observaciones registradas.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#94a3b8] px-1">
                            <HelpCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span>
                                Este cambio quedará registrado automáticamente en el historial de trazabilidad y auditoría.
                            </span>
                        </div>

                        {/* Botones de Confirmación */}
                        <div className="pt-3 border-t border-[#334155] flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentStep('FORM')
                                    setError(null)
                                }}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white border border-[#334155] transition disabled:opacity-50 cursor-pointer"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Modificar</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        <span>Actualizando...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>Confirmar y Cambiar Estado</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModalCambiarEstado

'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    X,
    CreditCard,
    Calendar,
    DollarSign,
    FileText,
    UploadCloud,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Search,
    ChevronDown,
    FileCheck,
    Trash2,
} from 'lucide-react'
import {
    crearPago,
    TIPOS_PAGO,
    ESTADOS_PAGO,
} from '@/services/cobro.service'
import { getIncapacidades } from '@/services/incapacidad.service'
import type { Pago } from '@/contracts/cobros'
import type { Incapacidad } from '@/contracts/incapacidades'

interface ModalRegistrarPagoProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (pago: Pago) => void
    preselectedIncapacidadId?: number
    preselectedIncapacidadTitle?: string
    preselectedEntidadId?: number
    preselectedEntidadNombre?: string
    valorSugerido?: string
}

export function ModalRegistrarPago({
    isOpen,
    onClose,
    onSuccess,
    preselectedIncapacidadId,
    preselectedIncapacidadTitle,
    preselectedEntidadId,
    preselectedEntidadNombre,
    valorSugerido,
}: ModalRegistrarPagoProps) {
    const [selectedPickerId, setSelectedPickerId] = useState<number | null>(null)
    const [entidadId, setEntidadId] = useState<number>(preselectedEntidadId ?? 1)
    const [entidadNombre, setEntidadNombre] = useState<string>(preselectedEntidadNombre ?? '')
    const [tipoPago, setTipoPago] = useState<string>('Transferencia bancaria')
    const [estadoPago, setEstadoPago] = useState<string>('Pagado')
    const [valor, setValor] = useState<string>(valorSugerido ?? '')
    const [fechaPago, setFechaPago] = useState<string>(() =>
        new Date().toISOString().split('T')[0]
    )
    const [referencia, setReferencia] = useState<string>('')
    const [periodoContable, setPeriodoContable] = useState<string>(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
    const [observaciones, setObservaciones] = useState<string>('')
    const [archivoSoporte, setArchivoSoporte] = useState<File | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Incapacidades list for picker when not preselected
    const [incapacidadesList, setIncapacidadesList] = useState<Incapacidad[]>([])
    const [loadingIncapacidades, setLoadingIncapacidades] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showPicker, setShowPicker] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const incapacidadId = preselectedIncapacidadId ?? selectedPickerId

    useEffect(() => {
        if (!isOpen) return

        if (!preselectedIncapacidadId) {
            let isMounted = true
            getIncapacidades({ limit: 50 })
                .then((res) => {
                    if (isMounted) {
                        const list = res.items || []
                        setIncapacidadesList(list)
                        if (list.length > 0 && !selectedPickerId) {
                            setSelectedPickerId(list[0].id_incapacidad)
                            setEntidadId(list[0].entidad?.id_entidad || 1)
                            setEntidadNombre(list[0].entidad?.nombre || 'EPS')
                        }
                        setLoadingIncapacidades(false)
                    }
                })
                .catch((err) => {
                    console.error('Error al cargar incapacidades:', err)
                    if (isMounted) setLoadingIncapacidades(false)
                })

            return () => {
                isMounted = false
            }
        }
    }, [isOpen, preselectedIncapacidadId, selectedPickerId])

    if (!isOpen) return null

    const selectedIncapacidad = incapacidadesList.find(
        (i) => i.id_incapacidad === incapacidadId
    )

    const filteredIncapacidades = incapacidadesList.filter((item) => {
        const query = searchTerm.toLowerCase()
        const idMatch = item.id_incapacidad.toString().includes(query)
        const tituloMatch = item.titulo?.toLowerCase().includes(query)
        const entidadMatch = item.entidad?.nombre?.toLowerCase().includes(query)
        return idMatch || tituloMatch || entidadMatch
    })

    const handleSelectIncapacidad = (inc: Incapacidad) => {
        setSelectedPickerId(inc.id_incapacidad)
        if (inc.entidad?.id_entidad) {
            setEntidadId(inc.entidad.id_entidad)
            setEntidadNombre(inc.entidad.nombre)
        }
        setShowPicker(false)
    }

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
        if (file.size > 10 * 1024 * 1024) {
            setErrorMsg('El archivo soporte no puede exceder 10MB.')
            return
        }
        setErrorMsg(null)
        setArchivoSoporte(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)

        if (!incapacidadId) {
            setErrorMsg('Debes seleccionar una incapacidad asociada al pago.')
            return
        }

        if (!valor || parseFloat(valor) <= 0) {
            setErrorMsg('Ingresa un valor monetario recibido válido mayor a cero.')
            return
        }

        if (!fechaPago) {
            setErrorMsg('Selecciona la fecha del pago o consignación.')
            return
        }

        setSubmitting(true)

        try {
            // Build full description containing reference and observations
            let desc = observaciones.trim()
            if (referencia.trim()) {
                desc = `[Ref: ${referencia.trim()}] ${desc}`
            }

            const nuevo = await crearPago(
                {
                    id_incapacidad: incapacidadId,
                    id_entidad: entidadId,
                    tipo_pago: tipoPago,
                    estado_pago: estadoPago,
                    valor: valor.trim(),
                    fecha_pago: fechaPago,
                    descripcion: desc.trim() || undefined,
                    periodo_contable: periodoContable.trim() || undefined,
                },
                archivoSoporte || undefined
            )

            onSuccess(nuevo)
            onClose()
        } catch (err: unknown) {
            console.error('Error al registrar pago:', err)
            let msg = 'No se pudo registrar el pago.'
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
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Registrar Pago de Incapacidad
                            </h2>
                            <p className="text-xs text-[#94a3b8]">
                                Asocia la consignación o giro bancario de la EPS/ARL con soporte
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {/* Incapacidad Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Incapacidad Asociada <span className="text-red-400">*</span>
                        </label>
                        {preselectedIncapacidadId ? (
                            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                                            INC #{preselectedIncapacidadId}
                                        </span>
                                        <span className="text-sm font-medium text-white">
                                            {preselectedIncapacidadTitle || 'Incapacidad seleccionada'}
                                        </span>
                                    </div>
                                    {entidadNombre && (
                                        <p className="text-xs text-[#94a3b8]">
                                            Entidad Pagadora: <span className="text-slate-200">{entidadNombre}</span>
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
                                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold shrink-0">
                                                INC #{selectedIncapacidad.id_incapacidad}
                                            </span>
                                            <span className="truncate font-medium">
                                                {selectedIncapacidad.titulo || 'Sin título'}
                                            </span>
                                            <span className="text-[#94a3b8] text-[11px] shrink-0">
                                                ({selectedIncapacidad.entidad?.nombre || 'EPS'})
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
                                                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#111827] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                                                        onClick={() => handleSelectIncapacidad(inc)}
                                                        className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition ${
                                                            inc.id_incapacidad === incapacidadId
                                                                ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                                                                : 'hover:bg-[#1e293b] text-slate-300'
                                                        }`}
                                                    >
                                                        <div className="truncate pr-2">
                                                            <span className="font-mono text-emerald-400 mr-2">
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

                    {/* Valor Recibido & Fecha de Pago */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Valor Recibido / Consignado ($) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    placeholder="Ej: 1250000"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Fecha de Consignación / Giro <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="date"
                                    value={fechaPago}
                                    onChange={(e) => setFechaPago(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tipo de Pago & Estado de Pago */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Tipo de Liquidación <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={tipoPago}
                                onChange={(e) => setTipoPago(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-emerald-500"
                            >
                                {TIPOS_PAGO.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Estado del Pago <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={estadoPago}
                                onChange={(e) => setEstadoPago(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-emerald-500"
                            >
                                {ESTADOS_PAGO.map((esp) => (
                                    <option key={esp.value} value={esp.value}>
                                        {esp.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Referencia & Periodo Contable */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Referencia / No. Comprobante Bancario
                            </label>
                            <div className="relative">
                                <FileText className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={referencia}
                                    onChange={(e) => setReferencia(e.target.value)}
                                    placeholder="Ej: TRF-908234-BANCOLOMBIA"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">
                                Periodo Contable (Año-Mes)
                            </label>
                            <input
                                type="text"
                                value={periodoContable}
                                onChange={(e) => setPeriodoContable(e.target.value)}
                                placeholder="YYYY-MM (Ej: 2026-03)"
                                className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                            />
                        </div>
                    </div>

                    {/* Archivo Soporte Bancario */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                            <span>Archivo Soporte / Comprobante de Giro</span>
                            <span className="text-[11px] text-[#94a3b8]">Opcional (PDF, PNG, JPG máx 10MB)</span>
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {archivoSoporte ? (
                            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-emerald-500/30 flex items-center justify-between">
                                <div className="flex items-center gap-2.5 truncate">
                                    <FileCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                                    <div className="truncate">
                                        <p className="text-xs font-medium text-white truncate">
                                            {archivoSoporte.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {(archivoSoporte.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setArchivoSoporte(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#1e293b] transition"
                                    title="Remover archivo"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setIsDragOver(true)
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                                    isDragOver
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-[#334155] hover:border-slate-500 bg-[#0f172a]/60'
                                }`}
                            >
                                <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                                <p className="text-xs font-medium text-slate-300">
                                    Arrastra el comprobante de pago o haz clic para examinar
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                    Se asociará automáticamente a la incapacidad
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Observaciones de la Liquidación
                        </label>
                        <textarea
                            rows={2}
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Detalle sobre días reconocidos, deducciones aplicadas o notas de auditoría..."
                            className="w-full p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
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
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Guardando Pago...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Registrar Pago</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    CheckCircle2,
    AlertTriangle,
    Download,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Building2,
    Check,
    X,
    FileSpreadsheet,
    Loader2,
    ExternalLink,
    Filter,
    RefreshCw,
} from 'lucide-react'
import type { Pago } from '@/contracts/cobros'
import type { Incapacidad } from '@/contracts/incapacidades'
import type { User } from '@/contracts/auth'
import { ESTADOS_PAGO } from '@/services/cobro.service'
import { exportToExcelCsv, type ExportExcelColumn } from '@/lib/export-excel'

export interface ConciliacionItem {
    id_pago: number
    pago: Pago
    incapacidad?: Incapacidad
    colaborador?: User
    nombreColaborador: string
    documentoColaborador: string
    entidadNombre: string
    entidadTipo: string
    diasIncapacidad: number
    fechasIncapacidad: string
    valorEsperado: number
    valorPagado: number
    diferencia: number
    porcentajePago: number
    tieneDiferencia: boolean
    estadoPago: string
    conciliado: boolean
    fechaPago: string
    periodoContable: string
    referencia: string
}

interface ConciliacionExcelGridProps {
    items: ConciliacionItem[]
    isLoading?: boolean
    onToggleConciliar: (idPago: number, nuevoEstado: boolean) => Promise<void>
    onBatchConciliar?: (ids: number[]) => Promise<void>
    onRefresh?: () => void
}

type SortColumn =
    | 'entidad'
    | 'colaborador'
    | 'esperado'
    | 'pagado'
    | 'diferencia'
    | 'estado'
    | 'conciliado'
    | 'fecha'

type SortDirection = 'asc' | 'desc' | null

export function ConciliacionExcelGrid({
    items,
    isLoading = false,
    onToggleConciliar,
    onBatchConciliar,
    onRefresh,
}: ConciliacionExcelGridProps) {
    // Selection state for Excel-like batch actions
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('')
    const [diferenciaFilter, setDiferenciaFilter] = useState<'todas' | 'con_diferencia' | 'sin_diferencia'>('todas')
    const [entidadFilter, setEntidadFilter] = useState<string>('todas')
    const [soloPendientes, setSoloPendientes] = useState(false)

    // Sort state
    const [sortColumn, setSortColumn] = useState<SortColumn>('diferencia')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

    // In-flight action tracking
    const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())
    const [isBatchProcessing, setIsBatchProcessing] = useState(false)

    // Unique entities for filtering
    const entidadesDisponibles = useMemo(() => {
        const set = new Set<string>()
        items.forEach((item) => {
            if (item.entidadNombre) set.add(item.entidadNombre)
        })
        return Array.from(set).sort()
    }, [items])

    // Filtered & Sorted items
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Search query
            const q = searchTerm.toLowerCase().trim()
            if (q) {
                const matchNombre = item.nombreColaborador.toLowerCase().includes(q)
                const matchDoc = item.documentoColaborador.toLowerCase().includes(q)
                const matchEntidad = item.entidadNombre.toLowerCase().includes(q)
                const matchRef = item.referencia.toLowerCase().includes(q)
                const matchInc = item.incapacidad?.id_incapacidad.toString().includes(q)
                const matchPago = item.id_pago.toString().includes(q)
                if (!matchNombre && !matchDoc && !matchEntidad && !matchRef && !matchInc && !matchPago) {
                    return false
                }
            }

            // Diferencia filter
            if (diferenciaFilter === 'con_diferencia' && !item.tieneDiferencia) return false
            if (diferenciaFilter === 'sin_diferencia' && item.tieneDiferencia) return false

            // Entidad filter
            if (entidadFilter !== 'todas' && item.entidadNombre !== entidadFilter) return false

            // Solo pendientes toggle
            if (soloPendientes && item.conciliado) return false

            return true
        })
    }, [items, searchTerm, diferenciaFilter, entidadFilter, soloPendientes])

    const sortedItems = useMemo(() => {
        if (!sortColumn || !sortDirection) return filteredItems

        return [...filteredItems].sort((a, b) => {
            let valA: string | number = ''
            let valB: string | number = ''

            switch (sortColumn) {
                case 'entidad':
                    valA = a.entidadNombre.toLowerCase()
                    valB = b.entidadNombre.toLowerCase()
                    break
                case 'colaborador':
                    valA = a.nombreColaborador.toLowerCase()
                    valB = b.nombreColaborador.toLowerCase()
                    break
                case 'esperado':
                    valA = a.valorEsperado
                    valB = b.valorEsperado
                    break
                case 'pagado':
                    valA = a.valorPagado
                    valB = b.valorPagado
                    break
                case 'diferencia':
                    valA = a.diferencia
                    valB = b.diferencia
                    break
                case 'estado':
                    valA = a.estadoPago.toLowerCase()
                    valB = b.estadoPago.toLowerCase()
                    break
                case 'conciliado':
                    valA = a.conciliado ? 1 : 0
                    valB = b.conciliado ? 1 : 0
                    break
                case 'fecha':
                    valA = a.fechaPago || ''
                    valB = b.fechaPago || ''
                    break
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredItems, sortColumn, sortDirection])

    // Summary calculations (Excel Totals)
    const totals = useMemo(() => {
        return sortedItems.reduce(
            (acc, curr) => {
                acc.esperado += curr.valorEsperado
                acc.pagado += curr.valorPagado
                acc.diferencia += curr.diferencia > 0 ? curr.diferencia : 0
                if (curr.conciliado) acc.conciliadosCount++
                if (curr.tieneDiferencia) acc.conDiferenciaCount++
                return acc
            },
            {
                esperado: 0,
                pagado: 0,
                diferencia: 0,
                conciliadosCount: 0,
                conDiferenciaCount: 0,
            }
        )
    }, [sortedItems])

    // Handlers
    const handleSort = (col: SortColumn) => {
        if (sortColumn === col) {
            if (sortDirection === 'asc') setSortDirection('desc')
            else if (sortDirection === 'desc') setSortDirection(null)
            else setSortDirection('asc')
        } else {
            setSortColumn(col)
            setSortDirection('asc')
        }
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(sortedItems.map((i) => i.id_pago))
            setSelectedIds(allIds)
        } else {
            setSelectedIds(new Set())
        }
    }

    const handleToggleRow = (id: number) => {
        const next = new Set(selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIds(next)
    }

    const handleSingleConciliar = async (item: ConciliacionItem) => {
        const idPago = item.id_pago
        setProcessingIds((prev) => new Set(prev).add(idPago))
        try {
            await onToggleConciliar(idPago, !item.conciliado)
        } finally {
            setProcessingIds((prev) => {
                const next = new Set(prev)
                next.delete(idPago)
                return next
            })
        }
    }

    const handleBatchConciliarAction = async () => {
        if (!onBatchConciliar || selectedIds.size === 0) return
        setIsBatchProcessing(true)
        try {
            await onBatchConciliar(Array.from(selectedIds))
            setSelectedIds(new Set())
        } finally {
            setIsBatchProcessing(false)
        }
    }

    // Export to Excel / CSV
    const handleExportExcel = () => {
        const columns: ExportExcelColumn<ConciliacionItem>[] = [
            { header: 'ID Pago', accessor: (i) => i.id_pago },
            { header: 'ID Incapacidad', accessor: (i) => i.incapacidad?.id_incapacidad || '' },
            { header: 'Entidad Pagadora', accessor: (i) => i.entidadNombre },
            { header: 'Tipo Entidad', accessor: (i) => i.entidadTipo },
            { header: 'Colaborador', accessor: (i) => i.nombreColaborador },
            { header: 'Documento C.C.', accessor: (i) => i.documentoColaborador },
            { header: 'Fechas Incapacidad', accessor: (i) => i.fechasIncapacidad },
            { header: 'Días Incapacidad', accessor: (i) => i.diasIncapacidad },
            { header: 'Valor Esperado (COP)', accessor: (i) => i.valorEsperado },
            { header: 'Valor Pagado (COP)', accessor: (i) => i.valorPagado },
            { header: 'Diferencia / Glosa (COP)', accessor: (i) => i.diferencia },
            { header: 'Tiene Glosa', accessor: (i) => (i.tieneDiferencia ? 'SI' : 'NO') },
            { header: 'Estado del Pago', accessor: (i) => i.estadoPago },
            { header: 'Conciliado Contable', accessor: (i) => (i.conciliado ? 'CONCILIADO' : 'PENDIENTE') },
            { header: 'Fecha de Pago', accessor: (i) => i.fechaPago },
            { header: 'Periodo Contable', accessor: (i) => i.periodoContable },
            { header: 'Referencia / Soporte', accessor: (i) => i.referencia },
        ]

        const dateStr = new Date().toISOString().split('T')[0]
        exportToExcelCsv(
            sortedItems,
            columns,
            `conciliacion_contable_${dateStr}.csv`
        )
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(val)
    }

    const getEstadoBadge = (estado: string) => {
        const found = ESTADOS_PAGO.find(
            (e) => e.value.toLowerCase() === estado.toLowerCase()
        )
        const color = found?.color || 'text-slate-400 bg-slate-500/10 border-slate-500/20'
        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color}`}>
                {found?.label || estado}
            </span>
        )
    }

    const isAllSelected =
        sortedItems.length > 0 && selectedIds.size === sortedItems.length
    const isIndeterminate =
        selectedIds.size > 0 && selectedIds.size < sortedItems.length

    return (
        <div className="space-y-4">
            {/* Excel Ribbon Toolbar */}
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#334155] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-md">
                {/* Search & Quick Filters */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                    <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#64748b]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar colaborador, cédula, ref, EPS..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-purple-500 transition"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-2.5 text-[#64748b] hover:text-white"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>

                    {/* Filter Entidad */}
                    <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#64748b]" />
                        <select
                            value={entidadFilter}
                            onChange={(e) => setEntidadFilter(e.target.value)}
                            className="py-1.5 px-2.5 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                            <option value="todas">Todas las Entidades</option>
                            {entidadesDisponibles.map((ent) => (
                                <option key={ent} value={ent}>
                                    {ent}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Diferencias (6.1.6) */}
                    <div className="flex items-center gap-1.5">
                        <Filter className="h-3.5 w-3.5 text-[#64748b]" />
                        <select
                            value={diferenciaFilter}
                            onChange={(e) =>
                                setDiferenciaFilter(
                                    e.target.value as 'todas' | 'con_diferencia' | 'sin_diferencia'
                                )
                            }
                            className="py-1.5 px-2.5 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                            <option value="todas">Todas las Fila(s)</option>
                            <option value="con_diferencia">⚠️ Con Glosa / Diferencia</option>
                            <option value="sin_diferencia">✅ Sin Diferencia (100%)</option>
                        </select>
                    </div>

                    {/* Checkbox solo pendientes */}
                    <label className="flex items-center gap-1.5 text-xs text-[#cbd5e1] hover:text-white cursor-pointer select-none px-2 py-1 rounded bg-[#0f172a]/60 border border-[#334155]/60">
                        <input
                            type="checkbox"
                            checked={soloPendientes}
                            onChange={(e) => setSoloPendientes(e.target.checked)}
                            className="rounded border-[#334155] text-purple-600 focus:ring-0 cursor-pointer"
                        />
                        <span>Solo no conciliados</span>
                    </label>
                </div>

                {/* Actions & Export */}
                <div className="flex items-center gap-2 justify-end">
                    {/* Batch Reconcile Button */}
                    {selectedIds.size > 0 && onBatchConciliar && (
                        <button
                            type="button"
                            onClick={handleBatchConciliarAction}
                            disabled={isBatchProcessing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
                        >
                            {isBatchProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            <span>Conciliar seleccionados ({selectedIds.size})</span>
                        </button>
                    )}

                    {/* Export to Excel (6.1.5) */}
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-white text-xs font-medium shadow-sm transition cursor-pointer hover:border-emerald-500/50"
                        title="Exportar archivo CSV con formato para Microsoft Excel"
                    >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Exportar a Excel</span>
                        <Download className="h-3 w-3 text-[#94a3b8]" />
                    </button>

                    {/* Refresh Button */}
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#cbd5e1] hover:text-white transition cursor-pointer"
                            title="Recargar hoja contable"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Grid Container */}
            <div className="rounded-xl border border-[#334155] bg-[#111827] shadow-xl overflow-hidden">
                <div className="overflow-x-auto max-h-[68vh] scrollbar-thin scrollbar-thumb-[#334155]">
                    <table className="w-full text-left border-collapse text-xs">
                        {/* Sticky Excel Header */}
                        <thead className="sticky top-0 z-20 bg-[#0f172a] text-[#cbd5e1] font-semibold uppercase text-[11px] shadow-sm select-none border-b border-[#334155]">
                            <tr>
                                {/* Selector Checkbox */}
                                <th className="py-2.5 px-3 w-10 text-center border-r border-[#334155]/60 bg-[#0f172a]">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = isIndeterminate
                                        }}
                                        onChange={handleSelectAll}
                                        className="rounded border-[#334155] text-purple-600 focus:ring-0 cursor-pointer"
                                        title="Seleccionar todo"
                                    />
                                </th>

                                {/* Entidad */}
                                <th
                                    onClick={() => handleSort('entidad')}
                                    className="py-2.5 px-3.5 cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span>Entidad Pagadora</span>
                                        {sortColumn === 'entidad' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Colaborador */}
                                <th
                                    onClick={() => handleSort('colaborador')}
                                    className="py-2.5 px-3.5 cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span>Colaborador & Caso</span>
                                        {sortColumn === 'colaborador' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Fechas & Días */}
                                <th
                                    onClick={() => handleSort('fecha')}
                                    className="py-2.5 px-3.5 cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span>Fecha Pago / Período</span>
                                        {sortColumn === 'fecha' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Esperado */}
                                <th
                                    onClick={() => handleSort('esperado')}
                                    className="py-2.5 px-3.5 text-right cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        <span>Esperado (COP)</span>
                                        {sortColumn === 'esperado' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Pagado */}
                                <th
                                    onClick={() => handleSort('pagado')}
                                    className="py-2.5 px-3.5 text-right cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        <span>Pagado (COP)</span>
                                        {sortColumn === 'pagado' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Diferencia / Glosa */}
                                <th
                                    onClick={() => handleSort('diferencia')}
                                    className="py-2.5 px-3.5 text-center cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span>Diferencia / Glosa</span>
                                        {sortColumn === 'diferencia' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Estado */}
                                <th
                                    onClick={() => handleSort('estado')}
                                    className="py-2.5 px-3.5 text-center cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span>Estado Pago</span>
                                        {sortColumn === 'estado' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Conciliado */}
                                <th
                                    onClick={() => handleSort('conciliado')}
                                    className="py-2.5 px-3.5 text-center cursor-pointer hover:bg-[#1e293b] transition border-r border-[#334155]/60 whitespace-nowrap"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span>Conciliado</span>
                                        {sortColumn === 'conciliado' ? (
                                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-purple-400" /> : <ArrowDown className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <ArrowUpDown className="h-3 w-3 text-[#64748b] opacity-50" />
                                        )}
                                    </div>
                                </th>

                                {/* Acción */}
                                <th className="py-2.5 px-3 text-center whitespace-nowrap bg-[#0f172a]">
                                    Acción
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-[#334155]/50 bg-[#111827]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center">
                                        <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-solid border-purple-500 border-r-transparent mb-2" />
                                        <p className="text-xs text-[#94a3b8]">
                                            Cargando hoja contable y cruzando datos...
                                        </p>
                                    </td>
                                </tr>
                            ) : sortedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-slate-400">
                                        <FileSpreadsheet className="h-8 w-8 mx-auto text-[#64748b] mb-2 opacity-60" />
                                        <p className="text-sm font-medium text-white">
                                            No se encontraron pagos con los filtros actuales
                                        </p>
                                        <p className="text-xs text-[#94a3b8] mt-1">
                                            Prueba cambiando los filtros de búsqueda o el estado de conciliación.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                sortedItems.map((item) => {
                                    const isSelected = selectedIds.has(item.id_pago)
                                    const isBusy = processingIds.has(item.id_pago)

                                    return (
                                        <tr
                                            key={item.id_pago}
                                            className={`transition-colors border-b border-[#334155]/40 hover:bg-[#1e293b]/50 ${
                                                item.tieneDiferencia
                                                    ? 'border-l-4 border-l-amber-500 bg-amber-500/[0.02]'
                                                    : 'border-l-4 border-l-transparent'
                                            } ${isSelected ? 'bg-purple-900/15' : ''}`}
                                        >
                                            {/* Checkbox */}
                                            <td className="py-2.5 px-3 text-center border-r border-[#334155]/40">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleRow(item.id_pago)}
                                                    className="rounded border-[#334155] text-purple-600 focus:ring-0 cursor-pointer"
                                                />
                                            </td>

                                            {/* Entidad */}
                                            <td className="py-2.5 px-3.5 border-r border-[#334155]/40 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-white">
                                                        {item.entidadNombre}
                                                    </span>
                                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                                                        {item.entidadTipo}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Colaborador & Caso */}
                                            <td className="py-2.5 px-3.5 border-r border-[#334155]/40">
                                                <div className="font-medium text-white truncate max-w-[200px]" title={item.nombreColaborador}>
                                                    {item.nombreColaborador}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#94a3b8] font-mono">
                                                    <span>C.C. {item.documentoColaborador}</span>
                                                    {item.incapacidad && (
                                                        <Link
                                                            href={`/incapacidades/${item.incapacidad.id_incapacidad}`}
                                                            className="text-purple-400 hover:text-purple-300 flex items-center gap-0.5 hover:underline"
                                                            title="Ver detalle del caso"
                                                        >
                                                            <span>INC #{item.incapacidad.id_incapacidad}</span>
                                                            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Fecha Pago / Periodo */}
                                            <td className="py-2.5 px-3.5 border-r border-[#334155]/40 whitespace-nowrap font-mono text-[11px]">
                                                <div className="text-slate-200">
                                                    {item.fechaPago || '-'}
                                                </div>
                                                <div className="text-[10px] text-[#94a3b8]">
                                                    {item.periodoContable ? `Per: ${item.periodoContable}` : `${item.diasIncapacidad} días`}
                                                </div>
                                            </td>

                                            {/* Esperado */}
                                            <td className="py-2.5 px-3.5 text-right border-r border-[#334155]/40 whitespace-nowrap font-mono text-slate-300">
                                                {formatCurrency(item.valorEsperado)}
                                            </td>

                                            {/* Pagado */}
                                            <td className="py-2.5 px-3.5 text-right border-r border-[#334155]/40 whitespace-nowrap font-mono font-bold text-emerald-400">
                                                {formatCurrency(item.valorPagado)}
                                            </td>

                                            {/* Diferencia / Glosa (6.1.6) */}
                                            <td className="py-2.5 px-3.5 text-center border-r border-[#334155]/40 whitespace-nowrap">
                                                {item.tieneDiferencia ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                                        <AlertTriangle className="h-3 w-3 shrink-0" />
                                                        <span>-{formatCurrency(item.diferencia)}</span>
                                                    </span>
                                                ) : item.diferencia < 0 ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                                        <span>+{formatCurrency(Math.abs(item.diferencia))}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <Check className="h-3 w-3 shrink-0" />
                                                        <span>Exacto (100%)</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Estado Pago */}
                                            <td className="py-2.5 px-3.5 text-center border-r border-[#334155]/40 whitespace-nowrap">
                                                {getEstadoBadge(item.estadoPago)}
                                            </td>

                                            {/* Conciliado */}
                                            <td className="py-2.5 px-3.5 text-center border-r border-[#334155]/40 whitespace-nowrap">
                                                {item.conciliado ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>Conciliado</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                        <span>Pendiente</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Acción Rápida (6.1.3) */}
                                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleSingleConciliar(item)}
                                                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition flex items-center justify-center gap-1 mx-auto cursor-pointer ${
                                                        item.conciliado
                                                            ? 'text-[#94a3b8] hover:text-rose-400 hover:bg-rose-500/10 border border-[#334155]'
                                                            : 'text-white bg-purple-600 hover:bg-purple-500 shadow-sm'
                                                    } disabled:opacity-50`}
                                                    title={
                                                        item.conciliado
                                                            ? 'Desmarcar conciliación contable'
                                                            : 'Marcar como conciliado en contabilidad'
                                                    }
                                                >
                                                    {isBusy ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : item.conciliado ? (
                                                        <>
                                                            <X className="h-3 w-3" />
                                                            <span>Desmarcar</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="h-3 w-3" />
                                                            <span>Conciliar</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>

                        {/* Sticky Excel Summary Row (Totales) */}
                        {sortedItems.length > 0 && (
                            <tfoot className="sticky bottom-0 z-20 bg-[#0f172a] text-xs font-semibold text-white border-t-2 border-[#334155] shadow-lg select-none">
                                <tr>
                                    <td className="py-3 px-3 text-center border-r border-[#334155]/60 text-[11px] text-[#94a3b8]">
                                        Σ
                                    </td>
                                    <td className="py-3 px-3.5 border-r border-[#334155]/60">
                                        <span className="text-white">TOTALES HOJA</span>
                                    </td>
                                    <td className="py-3 px-3.5 border-r border-[#334155]/60 font-mono text-[11px] text-[#94a3b8]">
                                        {sortedItems.length} registros ({totals.conciliadosCount} conciliados)
                                    </td>
                                    <td className="py-3 px-3.5 border-r border-[#334155]/60 text-center font-mono text-[11px] text-[#94a3b8]">
                                        {totals.conDiferenciaCount > 0 ? `${totals.conDiferenciaCount} con glosa` : 'Sin glosas'}
                                    </td>
                                    <td className="py-3 px-3.5 text-right border-r border-[#334155]/60 font-mono text-slate-200">
                                        {formatCurrency(totals.esperado)}
                                    </td>
                                    <td className="py-3 px-3.5 text-right border-r border-[#334155]/60 font-mono font-bold text-emerald-400">
                                        {formatCurrency(totals.pagado)}
                                    </td>
                                    <td className="py-3 px-3.5 text-center border-r border-[#334155]/60 font-mono text-amber-400">
                                        {totals.diferencia > 0 ? `-${formatCurrency(totals.diferencia)}` : '$0'}
                                    </td>
                                    <td colSpan={3} className="py-3 px-3.5 text-right text-[11px] text-[#94a3b8]">
                                        <span>Efectividad Recaudo: </span>
                                        <span className="font-bold text-white font-mono">
                                            {totals.esperado > 0
                                                ? Math.min(100, Math.round((totals.pagado / totals.esperado) * 100))
                                                : 100}
                                            %
                                        </span>
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}

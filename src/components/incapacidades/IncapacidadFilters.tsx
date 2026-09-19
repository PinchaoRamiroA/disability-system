'use client'

import React, { useState } from 'react'
import {
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    RotateCcw,
} from 'lucide-react'
import type { Estado, TipoIncapacidad, Entidad } from '@/contracts/incapacidades'

interface IncapacidadFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    idEstado?: number
    onEstadoChange: (value?: number) => void
    idTipo?: number
    onTipoChange: (value?: number) => void
    idEntidad?: number
    onEntidadChange: (value?: number) => void
    origen?: string
    onOrigenChange: (value?: string) => void
    canalRecepcion?: string
    onCanalChange: (value?: string) => void
    fechaInicio?: string
    onFechaInicioChange: (value?: string) => void
    fechaFin?: string
    onFechaFinChange: (value?: string) => void
    estados: Estado[]
    tipos: TipoIncapacidad[]
    entidades: Entidad[]
    onClearFilters: () => void
    activeFiltersCount: number
}

const ORIGEN_OPTIONS = [
    { value: 'enfermedad_general', label: 'Enfermedad General' },
    { value: 'accidente_trabajo', label: 'Accidente de Trabajo' },
    { value: 'accidente_transito', label: 'Accidente de Tránsito' },
    { value: 'maternidad', label: 'Maternidad' },
    { value: 'paternidad', label: 'Paternidad' },
]

const CANAL_OPTIONS = [
    { value: 'virtual', label: 'Portal Virtual' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'presencial', label: 'Presencial / Radicado Físico' },
    { value: 'fax', label: 'Fax' },
]

export function IncapacidadFilters({
    search,
    onSearchChange,
    idEstado,
    onEstadoChange,
    idTipo,
    onTipoChange,
    idEntidad,
    onEntidadChange,
    origen,
    onOrigenChange,
    canalRecepcion,
    onCanalChange,
    fechaInicio,
    onFechaInicioChange,
    fechaFin,
    onFechaFinChange,
    estados,
    tipos,
    entidades,
    onClearFilters,
    activeFiltersCount,
}: IncapacidadFiltersProps) {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

    return (
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 shadow-sm space-y-3">
            {/* Primary Filter Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search input with icon */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por colaborador, documento, código o radicado..."
                        className="w-full pl-9 pr-9 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Quick Select: Estado */}
                <div className="w-full md:w-48 shrink-0">
                    <select
                        value={idEstado || ''}
                        onChange={(e) =>
                            onEstadoChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    >
                        <option value="">Todos los Estados</option>
                        {estados.map((est) => (
                            <option key={est.id_estado} value={est.id_estado}>
                                {est.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quick Select: Entidad (EPS / ARL) */}
                <div className="w-full md:w-48 shrink-0">
                    <select
                        value={idEntidad || ''}
                        onChange={(e) =>
                            onEntidadChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    >
                        <option value="">Todas las Entidades</option>
                        {entidades.map((ent) => (
                            <option key={ent.id_entidad} value={ent.id_entidad}>
                                {ent.nombre} ({ent.tipo})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Advanced Filters Toggle Button */}
                <button
                    onClick={() => setIsAdvancedOpen((prev) => !prev)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition shrink-0 ${
                        isAdvancedOpen || activeFiltersCount > 0
                            ? 'bg-blue-600/15 text-blue-400 border-blue-500/30'
                            : 'bg-[#1e293b] text-[#cbd5e1] hover:text-white border-[#334155]'
                    }`}
                >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                        <span className="h-4 min-w-[16px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                    {isAdvancedOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                    )}
                </button>

                {/* Clear filters button */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        title="Limpiar todos los filtros"
                        className="p-2 rounded-lg bg-[#1e293b] text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 border border-[#334155] transition shrink-0"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Advanced Filters Panel */}
            {isAdvancedOpen && (
                <div className="pt-3 border-t border-[#334155] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
                    {/* Tipo de Incapacidad */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-[#94a3b8]">
                            Tipo de Incapacidad
                        </label>
                        <select
                            value={idTipo || ''}
                            onChange={(e) =>
                                onTipoChange(e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Todos los tipos</option>
                            {tipos.map((tip) => (
                                <option key={tip.id_tipo} value={tip.id_tipo}>
                                    {tip.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Origen de Contingencia */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-[#94a3b8]">
                            Origen de Contingencia
                        </label>
                        <select
                            value={origen || ''}
                            onChange={(e) => onOrigenChange(e.target.value || undefined)}
                            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Todos los orígenes</option>
                            {ORIGEN_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Canal de Recepción */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-[#94a3b8]">
                            Canal de Recepción
                        </label>
                        <select
                            value={canalRecepcion || ''}
                            onChange={(e) => onCanalChange(e.target.value || undefined)}
                            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Todos los canales</option>
                            {CANAL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rango de Fechas */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-[#94a3b8]">
                            Rango de Fechas (Inicio / Fin)
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                            <input
                                type="date"
                                value={fechaInicio || ''}
                                onChange={(e) => onFechaInicioChange(e.target.value || undefined)}
                                className="w-full px-2 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-[11px] text-white focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="date"
                                value={fechaFin || ''}
                                onChange={(e) => onFechaFinChange(e.target.value || undefined)}
                                className="w-full px-2 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-[11px] text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default IncapacidadFilters

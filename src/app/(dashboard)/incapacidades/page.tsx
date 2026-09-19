'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    FileText,
    PlusCircle,
    Eye,
    RefreshCw,
    AlertCircle,
    Calendar,
    Building2,
    CheckCircle2,
} from 'lucide-react'
import type {
    Incapacidad,
    Estado,
    TipoIncapacidad,
    Entidad,
} from '@/contracts/incapacidades'
import { incapacidadService, type IncapacidadQueryParams } from '@/services/incapacidad.service'
import { Table, type Column } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { IncapacidadFilters } from '@/components/incapacidades/IncapacidadFilters'
import { ModalCambiarEstado } from '@/components/incapacidades/ModalCambiarEstado'

// Fallback catalogs if backend catalog endpoints return empty
const FALLBACK_ESTADOS: Estado[] = [
    { id_estado: 1, nombre: 'Recibida', descripcion: 'Incapacidad radicada en el sistema', permite_transicion: true },
    { id_estado: 2, nombre: 'En validación documental', descripcion: 'Documentación en revisión médica', permite_transicion: true },
    { id_estado: 3, nombre: 'Pendiente transcripción', descripcion: 'Pendiente de radicar ante EPS/ARL', permite_transicion: true },
    { id_estado: 4, nombre: 'Transcrita', descripcion: 'Radicada y transcrita ante la entidad', permite_transicion: true },
    { id_estado: 5, nombre: 'En verificación EPS', descripcion: 'En auditoría por la entidad de salud', permite_transicion: true },
    { id_estado: 6, nombre: 'Aprobada', descripcion: 'Aprobada para reconocimiento económico', permite_transicion: true },
    { id_estado: 7, nombre: 'Pendiente pago', descripcion: 'Pendiente de giro por EPS', permite_transicion: true },
    { id_estado: 8, nombre: 'Pagada', descripcion: 'Pago liquidado y registrado', permite_transicion: true },
    { id_estado: 9, nombre: 'Rechazada', descripcion: 'Incapacidad denegada por EPS/ARL', permite_transicion: true },
    { id_estado: 10, nombre: 'Cobro persuasivo', descripcion: 'En gestión de cobro administrativo', permite_transicion: true },
    { id_estado: 11, nombre: 'Cobro jurídico', descripcion: 'Escalada a proceso legal', permite_transicion: true },
]

const FALLBACK_ENTIDADES: Entidad[] = [
    { id_entidad: 1, nombre: 'EPS SURA', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
    { id_entidad: 2, nombre: 'Sanitas EPS', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
    { id_entidad: 3, nombre: 'Nueva EPS', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 60, canal_atencion: 'presencial', canales_atencion: ['presencial'], requiere_transcripcion: true },
    { id_entidad: 4, nombre: 'Salud Total', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
    { id_entidad: 5, nombre: 'Positiva ARL', tipo: 'ARL', plazo_transcripcion_dias: 15, tiempo_maximo_pago_dias: 30, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
    { id_entidad: 6, nombre: 'SURA ARL', tipo: 'ARL', plazo_transcripcion_dias: 15, tiempo_maximo_pago_dias: 30, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
]

export default function IncapacidadesPage() {
    const router = useRouter()
    const [, startTransition] = useTransition()

    // Data States
    const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [successNotification, setSuccessNotification] = useState<string | null>(null)

    // Catalogs
    const [estados, setEstados] = useState<Estado[]>(FALLBACK_ESTADOS)
    const [tipos, setTipos] = useState<TipoIncapacidad[]>([])
    const [entidades, setEntidades] = useState<Entidad[]>(FALLBACK_ENTIDADES)

    // Filter & Pagination States
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [idEstado, setIdEstado] = useState<number | undefined>()
    const [idTipo, setIdTipo] = useState<number | undefined>()
    const [idEntidad, setIdEntidad] = useState<number | undefined>()
    const [origen, setOrigen] = useState<string | undefined>()
    const [canalRecepcion, setCanalRecepcion] = useState<string | undefined>()
    const [fechaInicio, setFechaInicio] = useState<string | undefined>()
    const [fechaFin, setFechaFin] = useState<string | undefined>()

    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Modal state
    const [selectedIncapacidadForState, setSelectedIncapacidadForState] =
        useState<Incapacidad | null>(null)

    // Debounce search input (350ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 350)
        return () => clearTimeout(timer)
    }, [search])

    // Load initial catalogs
    useEffect(() => {
        async function loadCatalogs() {
            try {
                const [estadosData, tiposData, entidadesData] = await Promise.all([
                    incapacidadService.getEstados(),
                    incapacidadService.getTipos(),
                    incapacidadService.getEntidades(),
                ])

                if (estadosData.length > 0) setEstados(estadosData)
                if (tiposData.length > 0) setTipos(tiposData)
                if (entidadesData.length > 0) setEntidades(entidadesData)
            } catch {
                // Keep fallbacks
            }
        }
        loadCatalogs()
    }, [])

    const handleReload = () => {
        setIsLoading(true)
        setRefreshTrigger((prev) => prev + 1)
    }

    // Fetch incapacidades cleanly
    useEffect(() => {
        let isMounted = true

        const queryParams: IncapacidadQueryParams = {
            page,
            limit,
            search: debouncedSearch || undefined,
            id_estado: idEstado,
            id_tipo: idTipo,
            id_entidad: idEntidad,
            origen,
            canal_recepcion: canalRecepcion,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
        }

        incapacidadService
            .getIncapacidades(queryParams)
            .then((res) => {
                if (!isMounted) return
                setIncapacidades(res.items || [])
                setTotal(res.total || 0)
                setTotalPages(res.total_pages || 1)
                setError(null)
            })
            .catch((err: unknown) => {
                if (!isMounted) return
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('Error al consultar el listado de incapacidades.')
                }
                setIncapacidades([])
                setTotal(0)
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [
        page,
        limit,
        debouncedSearch,
        idEstado,
        idTipo,
        idEntidad,
        origen,
        canalRecepcion,
        fechaInicio,
        fechaFin,
        refreshTrigger,
    ])

    // Clear filters helper
    const handleClearFilters = () => {
        setSearch('')
        setDebouncedSearch('')
        setIdEstado(undefined)
        setIdTipo(undefined)
        setIdEntidad(undefined)
        setOrigen(undefined)
        setCanalRecepcion(undefined)
        setFechaInicio(undefined)
        setFechaFin(undefined)
        setPage(1)
    }

    const activeFiltersCount = [
        Boolean(debouncedSearch),
        Boolean(idEstado),
        Boolean(idTipo),
        Boolean(idEntidad),
        Boolean(origen),
        Boolean(canalRecepcion),
        Boolean(fechaInicio),
        Boolean(fechaFin),
    ].filter(Boolean).length

    // Calculate days between two dates
    const calculateDays = (start: string, end: string) => {
        try {
            const s = new Date(start)
            const e = new Date(end)
            const diffTime = Math.abs(e.getTime() - s.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
            return isNaN(diffDays) ? '-' : `${diffDays} d`
        } catch {
            return '-'
        }
    }

    // Format human-friendly dates (DD/MM/YYYY)
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-'
        try {
            const d = new Date(dateString)
            if (isNaN(d.getTime())) return dateString
            return d.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        } catch {
            return dateString
        }
    }

    // Table Columns Configuration
    const columns: Column<Incapacidad>[] = [
        {
            key: 'id_incapacidad',
            header: 'Radicado / ID',
            width: '130px',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <FileText className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <span className="font-semibold text-white block">
                            #{row.id_incapacidad}
                        </span>
                        <span className="text-[10px] text-[#64748b]">
                            {row.canal_recepcion || 'virtual'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'titulo',
            header: 'Motivo / Título',
            render: (row) => (
                <div className="max-w-xs">
                    <p className="font-medium text-white truncate" title={row.titulo}>
                        {row.titulo}
                    </p>
                    <span className="text-[11px] text-[#94a3b8] capitalize">
                        {row.tipo?.nombre || 'General'} • {row.origen?.replace(/_/g, ' ') || 'Común'}
                    </span>
                </div>
            ),
        },
        {
            key: 'entidad',
            header: 'Entidad de Salud',
            width: '170px',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#64748b] shrink-0" />
                    <div>
                        <span className="text-white font-medium block truncate max-w-[140px]">
                            {row.entidad?.nombre || 'EPS SURA'}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-400">
                            {row.entidad?.tipo || 'EPS'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'fechas',
            header: 'Vigencia & Días',
            width: '190px',
            render: (row) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[11px] text-[#cbd5e1]">
                        <Calendar className="h-3 w-3 text-[#64748b]" />
                        <span>
                            {formatDate(row.fecha_inicio)} → {formatDate(row.fecha_fin)}
                        </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e293b] text-blue-300 border border-[#334155] font-semibold inline-block">
                        {calculateDays(row.fecha_inicio, row.fecha_fin)}
                    </span>
                </div>
            ),
        },
        {
            key: 'estado',
            header: 'Estado',
            width: '180px',
            render: (row) => (
                <StatusBadge status={row.estado?.nombre || 'Recibida'} />
            ),
        },
        {
            key: 'acciones',
            header: 'Acciones',
            width: '130px',
            align: 'right',
            render: (row) => (
                <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Ver detalle */}
                    <Link
                        href={`/incapacidades/${row.id_incapacidad}`}
                        title="Ver detalle del caso"
                        className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155] transition"
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Link>

                    {/* Cambiar estado */}
                    <button
                        onClick={() => setSelectedIncapacidadForState(row)}
                        title="Cambiar estado del trámite"
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Gestión de Incapacidades
                        </h1>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold">
                            {total} registradas
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Registro maestro, control de estados, seguimiento de contingencias y plazos perentorios.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleReload}
                        title="Recargar listado"
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-[#111827] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155] transition disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <Link
                        href="/incapacidades/crear"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition active:scale-95"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Radicar Incapacidad</span>
                    </Link>
                </div>
            </div>

            {/* Success Banner */}
            {successNotification && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{successNotification}</span>
                    </div>
                    <button
                        onClick={() => setSuccessNotification(null)}
                        className="text-[#94a3b8] hover:text-white text-xs"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={handleReload}
                        className="underline hover:text-white ml-2 text-xs font-semibold"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Filters Section */}
            <IncapacidadFilters
                search={search}
                onSearchChange={setSearch}
                idEstado={idEstado}
                onEstadoChange={(val) => {
                    setIdEstado(val)
                    setPage(1)
                }}
                idTipo={idTipo}
                onTipoChange={(val) => {
                    setIdTipo(val)
                    setPage(1)
                }}
                idEntidad={idEntidad}
                onEntidadChange={(val) => {
                    setIdEntidad(val)
                    setPage(1)
                }}
                origen={origen}
                onOrigenChange={(val) => {
                    setOrigen(val)
                    setPage(1)
                }}
                canalRecepcion={canalRecepcion}
                onCanalChange={(val) => {
                    setCanalRecepcion(val)
                    setPage(1)
                }}
                fechaInicio={fechaInicio}
                onFechaInicioChange={(val) => {
                    setFechaInicio(val)
                    setPage(1)
                }}
                fechaFin={fechaFin}
                onFechaFinChange={(val) => {
                    setFechaFin(val)
                    setPage(1)
                }}
                estados={estados}
                tipos={tipos}
                entidades={entidades}
                onClearFilters={handleClearFilters}
                activeFiltersCount={activeFiltersCount}
            />

            {/* Data Table */}
            <div className="space-y-0">
                <Table<Incapacidad>
                    data={incapacidades}
                    columns={columns}
                    keyExtractor={(row) => row.id_incapacidad}
                    isLoading={isLoading}
                    loadingRows={limit}
                    emptyMessage="No se encontraron incapacidades"
                    emptySubMessage={
                        activeFiltersCount > 0
                            ? 'Prueba ajustando o limpiando los filtros de búsqueda aplicados.'
                            : 'No hay incapacidades registradas en el sistema aún.'
                    }
                    onRowClick={(row) => {
                        startTransition(() => {
                            router.push(`/incapacidades/${row.id_incapacidad}`)
                        })
                    }}
                />

                {/* Server Pagination */}
                <Pagination
                    page={page}
                    limit={limit}
                    total={total}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit)
                        setPage(1)
                    }}
                    limitOptions={[10, 20, 50]}
                />
            </div>

            {/* Modal Cambiar Estado */}
            <ModalCambiarEstado
                isOpen={Boolean(selectedIncapacidadForState)}
                onClose={() => setSelectedIncapacidadForState(null)}
                incapacidad={selectedIncapacidadForState}
                estados={estados}
                onSuccess={() => {
                    setSuccessNotification('El estado de la incapacidad fue actualizado con éxito.')
                    handleReload()
                    setTimeout(() => setSuccessNotification(null), 4000)
                }}
            />
        </div>
    )
}

'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import {
    Folder,
    FileText,
    Image as ImageIcon,
    LayoutGrid,
    List,
    Search,
    Download,
    Eye,
    RefreshCw,
    Archive,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    ChevronRight,
    HardDrive,
    Info,
    X,
    Filter,
    ArrowUpRight,
} from 'lucide-react'
import type { Incapacidad, IncapacidadDocumento } from '@/contracts/incapacidades'
import { getIncapacidades } from '@/services/incapacidad.service'
import { getIncapacidadDocumentos } from '@/services/documento.service'
import { DocumentPreviewModal } from '@/components/documentos/DocumentPreviewModal'
import { ModalReemplazarDocumento } from '@/components/documentos/ModalReemplazarDocumento'
import { ModalConfirmarArchivar } from '@/components/documentos/ModalConfirmarArchivar'

// Estructura enriquecida de documento con contexto de la incapacidad padre
interface ArchivoDigitalItem extends IncapacidadDocumento {
    incapacidad?: Incapacidad
    entidadNombre?: string
    tipoIncapacidadNombre?: string
}

function ArchivoDigitalContent() {
    const [documentos, setDocumentos] = useState<ArchivoDigitalItem[]>([])
    const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Configuración de vista
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<ArchivoDigitalItem | null>(null)

    // Filtros (Tarea 3.3.2)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterEntidad, setFilterEntidad] = useState<string>('todas')
    const [filterTipoDoc, setFilterTipoDoc] = useState<string>('todos')
    const [filterEstado, setFilterEstado] = useState<string>('todos')
    const [filterFechaInicio, setFilterFechaInicio] = useState('')
    const [filterFechaFin, setFilterFechaFin] = useState('')
    const [showFiltersBar, setShowFiltersBar] = useState(false)

    // Modales de Acciones (Tareas 3.3.3 y 3.3.4)
    const [previewDoc, setPreviewDoc] = useState<IncapacidadDocumento | null>(null)
    const [reemplazarDoc, setReemplazarDoc] = useState<IncapacidadDocumento | null>(null)
    const [archivarDoc, setArchivarDoc] = useState<IncapacidadDocumento | null>(null)
    const [feedbackBanner, setFeedbackBanner] = useState<{
        type: 'success' | 'info' | 'error'
        text: string
    } | null>(null)

    // Cargar todas las incapacidades y sus documentos
    useEffect(() => {
        let isMounted = true
        async function loadArchiveData() {
            setIsLoading(true)
            try {
                const resIncs = await getIncapacidades({ limit: 50 })
                if (!isMounted) return

                const incList = resIncs?.items || []
                setIncapacidades(incList)

                // Cargar los documentos de las incapacidades en paralelo
                const docPromises = incList.map(async (inc) => {
                    try {
                        const docs = await getIncapacidadDocumentos(inc.id_incapacidad)
                        return docs.map(
                            (d): ArchivoDigitalItem => ({
                                ...d,
                                incapacidad: inc,
                                entidadNombre: inc.entidad?.nombre || 'EPS no asignada',
                                tipoIncapacidadNombre: inc.tipo?.nombre || 'General',
                            })
                        )
                    } catch {
                        return []
                    }
                })

                const allDocsArrays = await Promise.all(docPromises)
                if (!isMounted) return

                const flatDocs = allDocsArrays.flat()
                setDocumentos(flatDocs)
            } catch {
                if (isMounted) {
                    setFeedbackBanner({
                        type: 'error',
                        text: 'Error al cargar los archivos del repositorio digital.',
                    })
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadArchiveData()
        return () => {
            isMounted = false
        }
    }, [])

    // Lista de entidades únicas para carpetas y filtros
    const entidades = useMemo(() => {
        const set = new Set<string>()
        documentos.forEach((d) => {
            if (d.entidadNombre) set.add(d.entidadNombre)
        })
        return Array.from(set).sort()
    }, [documentos])

    // Lista de tipos de documentos únicos
    const tiposDocumento = useMemo(() => {
        const set = new Set<string>()
        documentos.forEach((d) => {
            if (d.tipo) set.add(d.tipo)
        })
        return Array.from(set).sort()
    }, [documentos])

    // Carpetas virtuales tipo Google Drive por Entidad
    const folderCards = useMemo(() => {
        return entidades.map((ent) => {
            const count = documentos.filter((d) => d.entidadNombre === ent).length
            return {
                id: ent,
                name: ent,
                count,
            }
        })
    }, [entidades, documentos])

    // Filtrado de archivos
    const filteredFiles = useMemo(() => {
        return documentos.filter((doc) => {
            // Carpeta seleccionada
            if (selectedFolder && doc.entidadNombre !== selectedFolder) {
                return false
            }

            // Búsqueda por texto (nombre, tipo, ID incapacidad)
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchesName = doc.nombre.toLowerCase().includes(q)
                const matchesTipo = (doc.tipo || '').toLowerCase().includes(q)
                const matchesIncId = String(doc.id_incapacidad).includes(q)
                const matchesEntidad = (doc.entidadNombre || '').toLowerCase().includes(q)
                if (!matchesName && !matchesTipo && !matchesIncId && !matchesEntidad) {
                    return false
                }
            }

            // Filtro por Entidad
            if (filterEntidad !== 'todas' && doc.entidadNombre !== filterEntidad) {
                return false
            }

            // Filtro por Tipo de Documento
            if (filterTipoDoc !== 'todos' && doc.tipo !== filterTipoDoc) {
                return false
            }

            // Filtro por Estado
            if (filterEstado !== 'todos') {
                const estLower = (doc.estado || '').toLowerCase()
                if (filterEstado === 'validado' && !estLower.includes('valid')) return false
                if (filterEstado === 'incompleto' && !estLower.includes('incomplet')) return false
                if (filterEstado === 'rechazado' && !estLower.includes('rechaz')) return false
                if (filterEstado === 'pendiente' && (estLower.includes('valid') || estLower.includes('rechaz') || estLower.includes('incomplet'))) return false
            }

            // Filtro por Fechas
            if (filterFechaInicio && doc.fecha_carga) {
                if (doc.fecha_carga < filterFechaInicio) return false
            }
            if (filterFechaFin && doc.fecha_carga) {
                if (doc.fecha_carga > filterFechaFin) return false
            }

            return true
        })
    }, [
        documentos,
        selectedFolder,
        searchQuery,
        filterEntidad,
        filterTipoDoc,
        filterEstado,
        filterFechaInicio,
        filterFechaFin,
    ])

    // Métricas del archivo
    const metrics = useMemo(() => {
        const total = documentos.length
        const pdfs = documentos.filter((d) =>
            (d.formato || d.nombre).toLowerCase().endsWith('.pdf')
        ).length
        const imagenes = documentos.filter((d) => {
            const f = (d.formato || d.nombre).toLowerCase()
            return f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
        }).length
        const validados = documentos.filter((d) => d.estado?.toLowerCase().includes('valid')).length
        return { total, pdfs, imagenes, validados }
    }, [documentos])

    // Callbacks post acciones
    const handleReplaced = (nuevoDoc: IncapacidadDocumento) => {
        setDocumentos((prev) =>
            prev.map((d) => {
                if (d.id_documento === nuevoDoc.id_documento) {
                    return {
                        ...nuevoDoc,
                        incapacidad: d.incapacidad,
                        entidadNombre: d.entidadNombre,
                        tipoIncapacidadNombre: d.tipoIncapacidadNombre,
                    }
                }
                return d
            })
        )
        setFeedbackBanner({
            type: 'success',
            text: `Soporte "${nuevoDoc.nombre}" reemplazado exitosamente con nueva versión.`,
        })
    }

    const handleArchived = (archivedDocId: number) => {
        setDocumentos((prev) => prev.filter((d) => d.id_documento !== archivedDocId))
        if (selectedFile?.id_documento === archivedDocId) {
            setSelectedFile(null)
        }
        setFeedbackBanner({
            type: 'info',
            text: 'Documento archivado exitosamente del expediente activo.',
        })
    }

    const clearFilters = () => {
        setSearchQuery('')
        setFilterEntidad('todas')
        setFilterTipoDoc('todos')
        setFilterEstado('todos')
        setFilterFechaInicio('')
        setFilterFechaFin('')
        setSelectedFolder(null)
    }

    const hasActiveFilters =
        filterEntidad !== 'todas' ||
        filterTipoDoc !== 'todos' ||
        filterEstado !== 'todos' ||
        Boolean(filterFechaInicio) ||
        Boolean(filterFechaFin) ||
        Boolean(selectedFolder) ||
        Boolean(searchQuery.trim())

    return (
        <div className="space-y-6">
            {/* Header con Pestañas de Navegación Cruzada */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <HardDrive className="h-6 w-6 text-indigo-400" />
                        <span>Expediente Documental & Archivo</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Almacén centralizado de certificados, historias clínicas y soportes de auditoría.
                    </p>
                </div>

                {/* Switcher de Vistas Principales */}
                <div className="flex items-center p-1 rounded-xl bg-[#111827] border border-[#334155]">
                    <Link
                        href="/documentos"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#94a3b8] hover:text-white transition"
                    >
                        Validación Documental
                    </Link>
                    <Link
                        href="/documentos/archivo"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
                    >
                        Archivo Digital (Drive)
                    </Link>
                </div>
            </div>

            {/* Banner de Feedback */}
            {feedbackBanner && (
                <div
                    className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in duration-200 ${
                        feedbackBanner.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : feedbackBanner.type === 'error'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        {feedbackBanner.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                            <Info className="h-4 w-4 shrink-0 text-blue-400" />
                        )}
                        <span className="font-semibold">{feedbackBanner.text}</span>
                    </div>
                    <button
                        onClick={() => setFeedbackBanner(null)}
                        className="p-1 hover:opacity-75 transition cursor-pointer"
                        title="Cerrar notificación"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Barra de Estadísticas de Almacenamiento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1">
                    <span className="text-[#94a3b8] text-[11px] block">Total Soportes en Nube</span>
                    <p className="text-xl font-bold text-white tracking-tight">{metrics.total}</p>
                    <p className="text-[10px] text-[#64748b]">En {incapacidades.length} expedientes</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1">
                    <span className="text-[#94a3b8] text-[11px] block">Expedientes PDF</span>
                    <p className="text-xl font-bold text-red-400 tracking-tight">{metrics.pdfs}</p>
                    <p className="text-[10px] text-[#64748b]">Documentos oficiales</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1">
                    <span className="text-[#94a3b8] text-[11px] block">Imágenes Clínicas</span>
                    <p className="text-xl font-bold text-cyan-400 tracking-tight">{metrics.imagenes}</p>
                    <p className="text-[10px] text-[#64748b]">JPG / PNG anexos</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#334155] space-y-1">
                    <span className="text-[#94a3b8] text-[11px] block">Soportes Auditados</span>
                    <p className="text-xl font-bold text-emerald-400 tracking-tight">{metrics.validados}</p>
                    <p className="text-[10px] text-emerald-400/80">Validados por SG-SST</p>
                </div>
            </div>

            {/* Barra de Control Google Drive: Breadcrumbs, Búsqueda y Switcher de Modo */}
            <div className="rounded-2xl bg-[#111827] border border-[#334155] p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Breadcrumbs de Navegación */}
                    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] overflow-x-auto whitespace-nowrap">
                        <button
                            type="button"
                            onClick={() => setSelectedFolder(null)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                                !selectedFolder
                                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                                    : 'hover:bg-[#1e293b] hover:text-white'
                            }`}
                        >
                            <HardDrive className="h-3.5 w-3.5" />
                            <span>Mi Unidad Digital</span>
                        </button>

                        {selectedFolder && (
                            <>
                                <ChevronRight className="h-3.5 w-3.5 text-[#64748b] shrink-0" />
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/15 text-blue-400 font-semibold">
                                    <Folder className="h-3.5 w-3.5" />
                                    <span>{selectedFolder}</span>
                                </span>
                            </>
                        )}
                    </div>

                    {/* Controles de Búsqueda y Modo de Vista */}
                    <div className="flex items-center gap-2">
                        {/* Input de Búsqueda */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748b]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar archivo o incapacidad..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Botón Filtros Avanzados */}
                        <button
                            type="button"
                            onClick={() => setShowFiltersBar(!showFiltersBar)}
                            className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                showFiltersBar || hasActiveFilters
                                    ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                                    : 'bg-[#0f172a] border-[#334155] text-[#94a3b8] hover:text-white'
                            }`}
                            title="Filtros avanzados"
                        >
                            <Filter className="h-4 w-4" />
                        </button>

                        {/* Switcher de Cuadrícula / Lista */}
                        <div className="flex items-center p-1 rounded-xl bg-[#0f172a] border border-[#334155]">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    viewMode === 'grid'
                                        ? 'bg-[#1e293b] text-white shadow'
                                        : 'text-[#94a3b8] hover:text-white'
                                }`}
                                title="Vista en cuadrícula"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    viewMode === 'list'
                                        ? 'bg-[#1e293b] text-white shadow'
                                        : 'text-[#94a3b8] hover:text-white'
                                }`}
                                title="Vista en lista"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de Filtros Desplegable (Tarea 3.3.2) */}
                {showFiltersBar && (
                    <div className="pt-3 border-t border-[#334155]/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
                        {/* Filtro Entidad */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1">
                                Entidad EPS / ARL
                            </label>
                            <select
                                value={filterEntidad}
                                onChange={(e) => setFilterEntidad(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="todas">Todas las entidades</option>
                                {entidades.map((ent) => (
                                    <option key={ent} value={ent}>
                                        {ent}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Tipo de Documento */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1">
                                Tipo de Soporte
                            </label>
                            <select
                                value={filterTipoDoc}
                                onChange={(e) => setFilterTipoDoc(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500 capitalize"
                            >
                                <option value="todos">Todos los tipos</option>
                                {tiposDocumento.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro Estado */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1">
                                Estado de Dictamen
                            </label>
                            <select
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="validado">Validados</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="incompleto">Subsanación Requerida</option>
                                <option value="rechazado">Rechazados</option>
                            </select>
                        </div>

                        {/* Rango de Fechas y Reset */}
                        <div>
                            <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1">
                                Fecha de Carga
                            </label>
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="date"
                                    value={filterFechaInicio}
                                    onChange={(e) => setFilterFechaInicio(e.target.value)}
                                    className="w-full px-2 py-1 text-[11px] rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none"
                                />
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 whitespace-nowrap cursor-pointer"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Carpetas Rápidas por Entidad (Google Drive Folders) */}
            {!selectedFolder && folderCards.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                            Carpetas por Entidad ({folderCards.length})
                        </span>
                        <span className="text-[11px] text-[#64748b]">
                            Haz clic para explorar los soportes de cada EPS/ARL
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {folderCards.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setSelectedFolder(f.id)}
                                className="p-3.5 rounded-2xl bg-[#111827] border border-[#334155] hover:border-blue-500/60 hover:bg-[#1e293b]/60 transition text-left cursor-pointer flex flex-col justify-between gap-3 group"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition">
                                        <Folder className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#64748b]">
                                        {f.count}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition">
                                        {f.name}
                                    </p>
                                    <p className="text-[10px] text-[#94a3b8]">
                                        {f.count} archivo{f.count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Explorador de Archivos (Grid o Lista) + Inspector Lateral */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Archivos (8 o 12 columnas según si hay inspector abierto) */}
                <div className={selectedFile ? 'lg:col-span-8 space-y-4' : 'lg:col-span-12 space-y-4'}>
                    <div className="flex items-center justify-between text-xs text-[#94a3b8] px-1">
                        <span>
                            Mostrando {filteredFiles.length} de {documentos.length} archivo{documentos.length !== 1 ? 's' : ''}
                        </span>
                        {selectedFolder && (
                            <button
                                type="button"
                                onClick={() => setSelectedFolder(null)}
                                className="text-blue-400 hover:underline cursor-pointer"
                            >
                                Ver todas las carpetas
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-44 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse"
                                />
                            ))}
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="p-16 text-center rounded-2xl bg-[#111827] border border-[#334155] space-y-3">
                            <Folder className="h-10 w-10 text-[#64748b] mx-auto" />
                            <h3 className="text-sm font-semibold text-white">
                                No se encontraron archivos
                            </h3>
                            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
                                No hay documentos que coincidan con la carpeta o los filtros seleccionados.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold transition"
                                >
                                    Restablecer Filtros
                                </button>
                            )}
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* VISTA CUADRÍCULA (Google Drive Tiles) */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredFiles.map((doc) => {
                                const isPdf = (doc.formato || doc.nombre).toLowerCase().endsWith('.pdf')
                                const isVal = doc.estado?.toLowerCase().includes('valid')
                                const isIncomp = doc.estado?.toLowerCase().includes('incomplet')
                                const isRech = doc.estado?.toLowerCase().includes('rechaz')
                                const isSelected = selectedFile?.id_documento === doc.id_documento

                                return (
                                    <div
                                        key={doc.id_documento}
                                        onClick={() => setSelectedFile(doc)}
                                        className={`rounded-2xl p-4 border transition cursor-pointer flex flex-col justify-between gap-3 group relative ${
                                            isSelected
                                                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                                                : 'bg-[#111827] border-[#334155] hover:border-[#475569] hover:bg-[#1e293b]/40'
                                        }`}
                                    >
                                        {/* Header de la tarjeta */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                                        isPdf
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                    }`}
                                                >
                                                    {doc.formato || (isPdf ? 'PDF' : 'IMG')}
                                                </span>

                                                <span
                                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                                                        isVal
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : isIncomp
                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            : isRech
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}
                                                >
                                                    {isVal && <CheckCircle2 className="h-2.5 w-2.5" />}
                                                    {isIncomp && <AlertTriangle className="h-2.5 w-2.5" />}
                                                    {isRech && <XCircle className="h-2.5 w-2.5" />}
                                                    {!isVal && !isIncomp && !isRech && (
                                                        <Clock className="h-2.5 w-2.5" />
                                                    )}
                                                    <span>{doc.estado || 'Pendiente'}</span>
                                                </span>
                                            </div>

                                            <span className="text-[10px] font-mono text-[#64748b]">
                                                #{doc.id_documento}
                                            </span>
                                        </div>

                                        {/* Icono central de previsualización */}
                                        <div className="py-4 text-center">
                                            {isPdf ? (
                                                <FileText className="h-12 w-12 text-red-400/80 mx-auto group-hover:scale-105 transition" />
                                            ) : (
                                                <ImageIcon className="h-12 w-12 text-cyan-400/80 mx-auto group-hover:scale-105 transition" />
                                            )}
                                            <p className="text-xs font-semibold text-white mt-2 truncate px-2" title={doc.nombre}>
                                                {doc.nombre}
                                            </p>
                                            <p className="text-[11px] text-[#94a3b8] capitalize truncate mt-0.5">
                                                {doc.tipo?.replace(/_/g, ' ')}
                                            </p>
                                        </div>

                                        {/* Metadatos y Barra de Acciones */}
                                        <div className="pt-2 border-t border-[#334155]/60 flex items-center justify-between text-[11px] text-[#94a3b8]">
                                            <span className="truncate">
                                                INC-{String(doc.id_incapacidad).padStart(4, '0')}
                                            </span>

                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                {/* Previsualizar */}
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                                    title="Previsualizar"
                                                >
                                                    <Eye className="h-3.5 w-3.5 text-cyan-400" />
                                                </button>

                                                {/* Descargar */}
                                                {doc.url && (
                                                    <a
                                                        href={doc.url}
                                                        download={doc.nombre}
                                                        className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                                        title="Descargar"
                                                    >
                                                        <Download className="h-3.5 w-3.5 text-emerald-400" />
                                                    </a>
                                                )}

                                                {/* Reemplazar */}
                                                <button
                                                    type="button"
                                                    onClick={() => setReemplazarDoc(doc)}
                                                    className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                                    title="Reemplazar versión"
                                                >
                                                    <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                                                </button>

                                                {/* Archivar */}
                                                <button
                                                    type="button"
                                                    onClick={() => setArchivarDoc(doc)}
                                                    className="p-1 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                                                    title="Archivar"
                                                >
                                                    <Archive className="h-3.5 w-3.5 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        /* VISTA LISTA / TABLA COMPACTA (Google Drive List) */
                        <div className="rounded-2xl bg-[#111827] border border-[#334155] overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-[11px] border-b border-[#334155]">
                                    <tr>
                                        <th className="py-3 px-4">Nombre de Archivo</th>
                                        <th className="py-3 px-4">Expediente</th>
                                        <th className="py-3 px-4">Entidad</th>
                                        <th className="py-3 px-4">Tipo</th>
                                        <th className="py-3 px-4">Estado</th>
                                        <th className="py-3 px-4">Fecha Carga</th>
                                        <th className="py-3 px-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#334155]/50">
                                    {filteredFiles.map((doc) => {
                                        const isPdf = (doc.formato || doc.nombre).toLowerCase().endsWith('.pdf')
                                        const isVal = doc.estado?.toLowerCase().includes('valid')
                                        const isIncomp = doc.estado?.toLowerCase().includes('incomplet')
                                        const isRech = doc.estado?.toLowerCase().includes('rechaz')
                                        const isSelected = selectedFile?.id_documento === doc.id_documento

                                        return (
                                            <tr
                                                key={doc.id_documento}
                                                onClick={() => setSelectedFile(doc)}
                                                className={`transition cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-blue-600/10 font-semibold'
                                                        : 'hover:bg-[#1e293b]/40'
                                                }`}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        {isPdf ? (
                                                            <FileText className="h-4 w-4 text-red-400 shrink-0" />
                                                        ) : (
                                                            <ImageIcon className="h-4 w-4 text-cyan-400 shrink-0" />
                                                        )}
                                                        <span className="text-white font-medium truncate max-w-[200px]" title={doc.nombre}>
                                                            {doc.nombre}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4 text-[#cbd5e1]">
                                                    INC-{String(doc.id_incapacidad).padStart(4, '0')}
                                                </td>

                                                <td className="py-3 px-4 text-[#94a3b8] truncate max-w-[140px]">
                                                    {doc.entidadNombre}
                                                </td>

                                                <td className="py-3 px-4 text-[#cbd5e1] capitalize truncate max-w-[140px]">
                                                    {doc.tipo?.replace(/_/g, ' ')}
                                                </td>

                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                                                            isVal
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : isIncomp
                                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                : isRech
                                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}
                                                    >
                                                        {isVal && <CheckCircle2 className="h-2.5 w-2.5" />}
                                                        {isIncomp && <AlertTriangle className="h-2.5 w-2.5" />}
                                                        {isRech && <XCircle className="h-2.5 w-2.5" />}
                                                        {!isVal && !isIncomp && !isRech && (
                                                            <Clock className="h-2.5 w-2.5" />
                                                        )}
                                                        <span>{doc.estado || 'Pendiente'}</span>
                                                    </span>
                                                </td>

                                                <td className="py-3 px-4 text-[#94a3b8] text-[11px]">
                                                    {doc.fecha_carga || doc.created_at || 'Reciente'}
                                                </td>

                                                <td className="py-3 px-4 text-right">
                                                    <div
                                                        className="flex items-center justify-end gap-1.5"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewDoc(doc)}
                                                            className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                                            title="Ver"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-cyan-400" />
                                                        </button>

                                                        {doc.url && (
                                                            <a
                                                                href={doc.url}
                                                                download={doc.nombre}
                                                                className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                                                title="Descargar"
                                                            >
                                                                <Download className="h-3.5 w-3.5 text-emerald-400" />
                                                            </a>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => setReemplazarDoc(doc)}
                                                            className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                                            title="Reemplazar"
                                                        >
                                                            <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => setArchivarDoc(doc)}
                                                            className="p-1 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                                                            title="Archivar"
                                                        >
                                                            <Archive className="h-3.5 w-3.5 text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Panel Lateral Inspector (Google Drive Details Drawer) */}
                {selectedFile && (
                    <div className="lg:col-span-4 rounded-2xl bg-[#111827] border border-[#334155] p-5 space-y-5 animate-in slide-in-from-right duration-200 sticky top-4">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    Detalles del Archivo
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition cursor-pointer"
                                title="Cerrar panel"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Preview / Thumbnail Header */}
                        <div className="p-6 rounded-xl bg-[#0f172a] border border-[#334155] text-center space-y-2">
                            {(selectedFile.formato || selectedFile.nombre).toLowerCase().endsWith('.pdf') ? (
                                <FileText className="h-16 w-16 text-red-400 mx-auto" />
                            ) : (
                                <ImageIcon className="h-16 w-16 text-cyan-400 mx-auto" />
                            )}
                            <h3 className="text-sm font-bold text-white break-words">
                                {selectedFile.nombre}
                            </h3>
                            <p className="text-[11px] text-[#94a3b8] uppercase font-mono">
                                Formato: {selectedFile.formato || 'PDF'}
                            </p>
                        </div>

                        {/* Metadatos Detallados */}
                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-[#334155]/60">
                                <span className="text-[#94a3b8]">Tipo de Soporte</span>
                                <span className="font-semibold text-white capitalize">
                                    {selectedFile.tipo?.replace(/_/g, ' ')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-[#334155]/60">
                                <span className="text-[#94a3b8]">Estado de Dictamen</span>
                                <span className="font-semibold text-blue-400">
                                    {selectedFile.estado || 'Pendiente'}
                                </span>
                            </div>

                            {selectedFile.comentario && (
                                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                                    <span className="text-[10px] text-[#64748b] block font-semibold uppercase">
                                        Observación Médica:
                                    </span>
                                    <p className="text-[11px] text-[#cbd5e1] italic">
                                        {selectedFile.comentario}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pb-2 border-b border-[#334155]/60">
                                <span className="text-[#94a3b8]">Fecha de Carga</span>
                                <span className="font-semibold text-white">
                                    {selectedFile.fecha_carga || selectedFile.created_at || 'Reciente'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-[#334155]/60">
                                <span className="text-[#94a3b8]">Entidad EPS/ARL</span>
                                <span className="font-semibold text-white truncate max-w-[160px]">
                                    {selectedFile.entidadNombre}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[#94a3b8]">Expediente Vinculado</span>
                                <Link
                                    href={`/incapacidades/${selectedFile.id_incapacidad}`}
                                    className="font-bold text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <span>INC-{String(selectedFile.id_incapacidad).padStart(4, '0')}</span>
                                    <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Barra de Acciones del Inspector (Tarea 3.3.4) */}
                        <div className="pt-2 border-t border-[#334155] grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setPreviewDoc(selectedFile)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition cursor-pointer"
                            >
                                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                                <span>Previsualizar</span>
                            </button>

                            {selectedFile.url && (
                                <a
                                    href={selectedFile.url}
                                    download={selectedFile.nombre}
                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition cursor-pointer"
                                >
                                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Descargar</span>
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={() => setReemplazarDoc(selectedFile)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow shadow-blue-600/20"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Reemplazar</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setArchivarDoc(selectedFile)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-semibold transition cursor-pointer"
                            >
                                <Archive className="h-3.5 w-3.5" />
                                <span>Archivar</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Previsualización (Tarea 3.3.3) */}
            <DocumentPreviewModal
                isOpen={Boolean(previewDoc)}
                onClose={() => setPreviewDoc(null)}
                documento={previewDoc}
            />

            {/* Modal de Reemplazar Documento (Tarea 3.3.4) */}
            <ModalReemplazarDocumento
                isOpen={Boolean(reemplazarDoc)}
                onClose={() => setReemplazarDoc(null)}
                documento={reemplazarDoc}
                onReplaced={handleReplaced}
            />

            {/* Modal de Archivar Documento (Tarea 3.3.4) */}
            <ModalConfirmarArchivar
                isOpen={Boolean(archivarDoc)}
                onClose={() => setArchivarDoc(null)}
                documento={archivarDoc}
                onArchived={handleArchived}
            />
        </div>
    )
}

export default function ArchivoDigitalPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <div className="h-16 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse"
                            />
                        ))}
                    </div>
                    <div className="h-96 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                </div>
            }
        >
            <ArchivoDigitalContent />
        </Suspense>
    )
}

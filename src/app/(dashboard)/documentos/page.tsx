'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    FileCheck,
    Upload,
    Search,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    FileText,
    Eye,
    Scale,
    Download,
    ArrowRight,
    X,
    User,
    Building2,
    Calendar,
    Layers,
    AlertCircle,
} from 'lucide-react'
import type { Incapacidad, IncapacidadDocumento } from '@/contracts/incapacidades'
import type { TipoDocumento } from '@/contracts/catalogos'
import {
    getIncapacidades,
    getIncapacidadById,
} from '@/services/incapacidad.service'
import {
    getIncapacidadDocumentos,
    getDocumentosRequeridos,
} from '@/services/documento.service'
import { DocumentChecklist } from '@/components/documentos/DocumentChecklist'
import { DocumentPreviewModal } from '@/components/documentos/DocumentPreviewModal'
import { FileUploader } from '@/components/documentos/FileUploader'
import { ModalValidarDocumento } from '@/components/documentos/ModalValidarDocumento'

function DocumentosContent() {
    const searchParams = useSearchParams()
    const queryIncapacidadId = searchParams.get('incapacidad_id') || searchParams.get('id')

    // Listado de incapacidades para selector
    const [incapacidades, setIncapacidades] = useState<Incapacidad[]>([])
    const [isLoadingIncapacidades, setIsLoadingIncapacidades] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Incapacidad seleccionada
    const [selectedId, setSelectedId] = useState<number | null>(
        queryIncapacidadId ? Number(queryIncapacidadId) : null
    )
    const [selectedIncapacidad, setSelectedIncapacidad] = useState<Incapacidad | null>(null)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)

    // Documentos de la incapacidad seleccionada
    const [documentos, setDocumentos] = useState<IncapacidadDocumento[]>([])
    const [requiredTipos, setRequiredTipos] = useState<TipoDocumento[]>([])
    const [filterEstado, setFilterEstado] = useState<string>('todos')
    const [docSearchQuery, setDocSearchQuery] = useState('')

    // Modales
    const [previewDoc, setPreviewDoc] = useState<IncapacidadDocumento | null>(null)
    const [validarDoc, setValidarDoc] = useState<IncapacidadDocumento | null>(null)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [uploadDefaultTipo, setUploadDefaultTipo] = useState<string>('')

    // Notificaciones
    const [bannerMessage, setBannerMessage] = useState<{
        type: 'success' | 'info' | 'error'
        text: string
    } | null>(null)

    // Cargar lista de incapacidades para auditoría
    useEffect(() => {
        let isMounted = true
        async function fetchIncapacidades() {
            setIsLoadingIncapacidades(true)
            try {
                const res = await getIncapacidades({ limit: 50 })
                if (isMounted && res?.items) {
                    setIncapacidades(res.items)
                    // Si no había selección y hay incapacidades, o venía en query
                    if (!selectedId && res.items.length > 0 && !queryIncapacidadId) {
                        setSelectedId(res.items[0].id_incapacidad)
                    }
                }
            } catch {
                if (isMounted) {
                    setIncapacidades([])
                }
            } finally {
                if (isMounted) {
                    setIsLoadingIncapacidades(false)
                }
            }
        }
        fetchIncapacidades()
        return () => {
            isMounted = false
        }
    }, [queryIncapacidadId])

    // Cargar detalle, documentos y tipos requeridos de la incapacidad seleccionada
    useEffect(() => {
        let isMounted = true
        async function loadIncapacidadData() {
            if (!selectedId) return

            setIsLoadingDetail(true)
            try {
                const [incData, docsData] = await Promise.all([
                    getIncapacidadById(selectedId),
                    getIncapacidadDocumentos(selectedId),
                ])

                if (!isMounted) return
                setSelectedIncapacidad(incData)
                setDocumentos(docsData)

                // Cargar tipos requeridos según id_tipo (Task 3.2.2)
                if (incData?.tipo?.id_tipo) {
                    const reqs = await getDocumentosRequeridos(incData.tipo.id_tipo)
                    if (isMounted) {
                        setRequiredTipos(reqs)
                    }
                }
            } catch {
                if (isMounted) {
                    setBannerMessage({
                        type: 'error',
                        text: 'No se pudo cargar la información de los soportes de la incapacidad.',
                    })
                }
            } finally {
                if (isMounted) {
                    setIsLoadingDetail(false)
                }
            }
        }

        loadIncapacidadData()
        return () => {
            isMounted = false
        }
    }, [selectedId])

    // Filtrar incapacidades para el selector
    const filteredIncapacidades = useMemo(() => {
        if (!searchTerm.trim()) return incapacidades
        const term = searchTerm.toLowerCase()
        return incapacidades.filter((inc) => {
            const idStr = String(inc.id_incapacidad)
            const title = (inc.titulo || '').toLowerCase()
            const tipo = (inc.tipo?.nombre || '').toLowerCase()
            const entidad = (inc.entidad?.nombre || '').toLowerCase()
            const userStr = String(inc.id_usuario)
            return (
                idStr.includes(term) ||
                title.includes(term) ||
                tipo.includes(term) ||
                entidad.includes(term) ||
                userStr.includes(term)
            )
        })
    }, [incapacidades, searchTerm])

    // Filtrar documentos
    const filteredDocs = useMemo(() => {
        return documentos.filter((doc) => {
            const matchesEstado =
                filterEstado === 'todos'
                    ? true
                    : filterEstado === 'pendiente'
                    ? !doc.estado || doc.estado.toLowerCase().includes('pend')
                    : filterEstado === 'validado'
                    ? doc.estado?.toLowerCase().includes('valid')
                    : filterEstado === 'incompleto'
                    ? doc.estado?.toLowerCase().includes('incomplet')
                    : filterEstado === 'rechazado'
                    ? doc.estado?.toLowerCase().includes('rechaz')
                    : true

            const matchesSearch =
                !docSearchQuery.trim() ||
                doc.nombre.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                (doc.tipo && doc.tipo.toLowerCase().includes(docSearchQuery.toLowerCase()))

            return matchesEstado && matchesSearch
        })
    }, [documentos, filterEstado, docSearchQuery])

    // Métricas de documentos
    const metrics = useMemo(() => {
        const total = documentos.length
        const validados = documentos.filter((d) => d.estado?.toLowerCase().includes('valid')).length
        const incompletos = documentos.filter((d) => d.estado?.toLowerCase().includes('incomplet')).length
        const rechazados = documentos.filter((d) => d.estado?.toLowerCase().includes('rechaz')).length
        const pendientes = total - validados - incompletos - rechazados
        return { total, validados, incompletos, rechazados, pendientes }
    }, [documentos])

    // Días de la incapacidad seleccionada
    const selectedDays = useMemo(() => {
        if (!selectedIncapacidad?.fecha_inicio || !selectedIncapacidad?.fecha_fin) return 0
        const start = new Date(selectedIncapacidad.fecha_inicio)
        const end = new Date(selectedIncapacidad.fecha_fin)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }, [selectedIncapacidad])

    // Callback post validación exitosa
    const handleDocumentValidated = (updatedDoc: IncapacidadDocumento) => {
        setDocumentos((prev) =>
            prev.map((d) => (d.id_documento === updatedDoc.id_documento ? updatedDoc : d))
        )
        setBannerMessage({
            type: 'success',
            text: `Documento "${updatedDoc.nombre}" dictaminado exitosamente como: ${updatedDoc.estado}.`,
        })
    }

    // Callback post subida exitosa
    const handleUploadSuccess = (nuevoDoc: IncapacidadDocumento) => {
        setDocumentos((prev) => [nuevoDoc, ...prev])
        setIsUploadModalOpen(false)
        setBannerMessage({
            type: 'success',
            text: `Documento "${nuevoDoc.nombre}" cargado exitosamente.`,
        })
    }

    const handleQuickUpload = (tipo: string) => {
        setUploadDefaultTipo(tipo)
        setIsUploadModalOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header Principal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <FileCheck className="h-6 w-6 text-blue-400" />
                        <span>Centro de Validación Documental</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Auditoría médica, checklist de requisitos legales por contingencia y dictamen de soportes.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Switcher de Vistas Principales */}
                    <div className="flex items-center p-1 rounded-xl bg-[#111827] border border-[#334155]">
                        <Link
                            href="/documentos"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
                        >
                            Validación Documental
                        </Link>
                        <Link
                            href="/documentos/archivo"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#94a3b8] hover:text-white transition"
                        >
                            Archivo Digital (Drive)
                        </Link>
                    </div>

                    {selectedId && (
                        <button
                            type="button"
                            onClick={() => {
                                setUploadDefaultTipo('')
                                setIsUploadModalOpen(true)
                            }}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            <span>Cargar Soporte</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Banner de Notificación */}
            {bannerMessage && (
                <div
                    className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in duration-200 ${
                        bannerMessage.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : bannerMessage.type === 'error'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        {bannerMessage.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : bannerMessage.type === 'error' ? (
                            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        ) : (
                            <Clock className="h-4 w-4 shrink-0 text-blue-400" />
                        )}
                        <span className="font-semibold">{bannerMessage.text}</span>
                    </div>
                    <button
                        onClick={() => setBannerMessage(null)}
                        className="p-1 hover:opacity-75 transition cursor-pointer"
                        title="Cerrar notificación"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Layout Principal: Selector a la izquierda / workspace a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Columna Izquierda: Selector de Incapacidad (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#334155]/60">
                            <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                                <Layers className="h-4 w-4 text-blue-400" />
                                <span>Expedientes ({incapacidades.length})</span>
                            </span>
                            <span className="text-[11px] text-[#94a3b8]">
                                Seleccione un caso
                            </span>
                        </div>

                        {/* Buscador de incapacidades */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748b]" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por ID, nombre o cédula..."
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Lista de Casos */}
                        <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                            {isLoadingIncapacidades ? (
                                <div className="space-y-2 py-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="h-16 rounded-xl bg-[#0f172a] border border-[#334155] animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : filteredIncapacidades.length === 0 ? (
                                <div className="py-8 text-center text-xs text-[#94a3b8]">
                                    No se encontraron incapacidades.
                                </div>
                            ) : (
                                filteredIncapacidades.map((inc) => {
                                    const isSelected = inc.id_incapacidad === selectedId
                                    return (
                                        <button
                                            key={inc.id_incapacidad}
                                            type="button"
                                            onClick={() => setSelectedId(inc.id_incapacidad)}
                                            className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                                                isSelected
                                                    ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                                                    : 'bg-[#0f172a] border-[#334155] hover:border-[#475569] hover:bg-[#1e293b]/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-xs font-bold ${
                                                        isSelected ? 'text-blue-400' : 'text-white'
                                                    }`}
                                                >
                                                    INC-{String(inc.id_incapacidad).padStart(4, '0')}
                                                </span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
                                                    {inc.estado?.nombre || 'Radicada'}
                                                </span>
                                            </div>

                                            <p className="text-xs text-[#cbd5e1] font-medium truncate">
                                                {inc.titulo || `Colaborador #${inc.id_usuario}`}
                                            </p>

                                            <div className="flex items-center justify-between text-[10px] text-[#94a3b8]">
                                                <span>{inc.tipo?.nombre || 'General'}</span>
                                                <span>{inc.entidad?.nombre || 'EPS'}</span>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Panel de Auditoría y Documentos (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {isLoadingDetail ? (
                        <div className="space-y-4">
                            <div className="h-32 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                            <div className="h-48 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                            <div className="h-64 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                        </div>
                    ) : selectedIncapacidad ? (
                        <>
                            {/* Card de Información de la Incapacidad Seleccionada */}
                            <div className="p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]/60">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base font-bold text-white tracking-tight">
                                                Incapacidad #{String(selectedIncapacidad.id_incapacidad).padStart(4, '0')}
                                            </h2>
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {selectedIncapacidad.tipo?.nombre || 'Enfermedad General'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#94a3b8] mt-0.5">
                                            {selectedIncapacidad.titulo || 'Registro de incapacidad médica'}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/incapacidades/${selectedIncapacidad.id_incapacidad}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition shrink-0"
                                    >
                                        <span>Ver Detalle Completo</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155]/80 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[#94a3b8] text-[11px]">
                                            <User className="h-3.5 w-3.5 text-blue-400" />
                                            <span>Colaborador</span>
                                        </div>
                                        <p className="font-semibold text-white truncate">
                                            ID #{selectedIncapacidad.id_usuario}
                                        </p>
                                        <p className="text-[10px] text-[#64748b]">
                                            Usuario Registrado
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155]/80 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[#94a3b8] text-[11px]">
                                            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                                            <span>Entidad EPS/ARL</span>
                                        </div>
                                        <p className="font-semibold text-white truncate">
                                            {selectedIncapacidad.entidad?.nombre || 'EPS no asignada'}
                                        </p>
                                        <p className="text-[10px] text-[#64748b]">
                                            Canal: {selectedIncapacidad.canal_recepcion || 'Portal'}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155]/80 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[#94a3b8] text-[11px]">
                                            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                                            <span>Periodo</span>
                                        </div>
                                        <p className="font-semibold text-white">
                                            {selectedDays} día{selectedDays !== 1 ? 's' : ''}
                                        </p>
                                        <p className="text-[10px] text-[#64748b]">
                                            {selectedIncapacidad.fecha_inicio} a {selectedIncapacidad.fecha_fin}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155]/80 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[#94a3b8] text-[11px]">
                                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                                            <span>Estado Actual</span>
                                        </div>
                                        <p className="font-semibold text-amber-400 truncate">
                                            {selectedIncapacidad.estado?.nombre || 'Radicada'}
                                        </p>
                                        <p className="text-[10px] text-[#64748b]">
                                            Origen: {selectedIncapacidad.origen || 'Común'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist Visual de Requisitos Legales (Tasks 3.2.2 & 3.2.4) */}
                            <DocumentChecklist
                                requiredTipos={requiredTipos}
                                uploadedDocs={documentos}
                                onQuickUpload={handleQuickUpload}
                            />

                            {/* Métricas y Tabs de Filtrado de Documentos */}
                            <div className="p-5 rounded-2xl bg-[#111827] border border-[#334155] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]/60">
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Soportes Adjuntos ({documentos.length})
                                        </h3>
                                        <p className="text-xs text-[#94a3b8]">
                                            Auditoría técnica individual de certificados y anexos clínicos
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUploadDefaultTipo('')
                                            setIsUploadModalOpen(true)
                                        }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition cursor-pointer"
                                    >
                                        <Upload className="h-3.5 w-3.5" />
                                        <span>Adjuntar Soporte</span>
                                    </button>
                                </div>

                                {/* Tabs de Estado de Validación */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFilterEstado('todos')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                            filterEstado === 'todos'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-[#0f172a] text-[#94a3b8] hover:text-white border border-[#334155]'
                                        }`}
                                    >
                                        Todos ({metrics.total})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterEstado('pendiente')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                            filterEstado === 'pendiente'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-[#0f172a] text-blue-400 hover:text-white border border-[#334155]'
                                        }`}
                                    >
                                        <Clock className="h-3 w-3" />
                                        <span>Pendientes ({metrics.pendientes})</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterEstado('validado')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                            filterEstado === 'validado'
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-[#0f172a] text-emerald-400 hover:text-white border border-[#334155]'
                                        }`}
                                    >
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>Validados ({metrics.validados})</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterEstado('incompleto')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                            filterEstado === 'incompleto'
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-[#0f172a] text-amber-400 hover:text-white border border-[#334155]'
                                        }`}
                                    >
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>Subsanar ({metrics.incompletos})</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterEstado('rechazado')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                            filterEstado === 'rechazado'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-[#0f172a] text-red-400 hover:text-white border border-[#334155]'
                                        }`}
                                    >
                                        <XCircle className="h-3 w-3" />
                                        <span>Rechazados ({metrics.rechazados})</span>
                                    </button>
                                </div>

                                {/* Buscador de Documentos */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748b]" />
                                    <input
                                        type="text"
                                        value={docSearchQuery}
                                        onChange={(e) => setDocSearchQuery(e.target.value)}
                                        placeholder="Filtrar soportes por nombre o tipo..."
                                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* Tabla de Soportes */}
                                {filteredDocs.length === 0 ? (
                                    <div className="py-12 text-center rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                                        <FileText className="h-8 w-8 text-[#64748b] mx-auto" />
                                        <p className="text-xs text-white font-medium">
                                            No hay documentos que coincidan con los filtros.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-[11px] border-b border-[#334155]">
                                                <tr>
                                                    <th className="py-3 px-4">Soporte / Archivo</th>
                                                    <th className="py-3 px-4">Tipo</th>
                                                    <th className="py-3 px-4">Estado Dictamen</th>
                                                    <th className="py-3 px-4">Carga / Auditoría</th>
                                                    <th className="py-3 px-4 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#334155]/50">
                                                {filteredDocs.map((doc) => {
                                                    const isVal = doc.estado?.toLowerCase().includes('valid')
                                                    const isIncomp = doc.estado?.toLowerCase().includes('incomplet')
                                                    const isRech = doc.estado?.toLowerCase().includes('rechaz')

                                                    return (
                                                        <tr
                                                            key={doc.id_documento}
                                                            className="hover:bg-[#1e293b]/40 transition"
                                                        >
                                                            <td className="py-3.5 px-4">
                                                                <div className="flex items-center gap-2.5">
                                                                    <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                                                                    <div>
                                                                        <span className="font-semibold text-white block">
                                                                            {doc.nombre}
                                                                        </span>
                                                                        <span className="text-[10px] text-[#94a3b8] uppercase">
                                                                            Formato: {doc.formato || 'PDF'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="py-3.5 px-4 text-[#cbd5e1] font-medium capitalize">
                                                                {doc.tipo?.replace(/_/g, ' ')}
                                                            </td>

                                                            <td className="py-3.5 px-4">
                                                                <span
                                                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                                                                        isVal
                                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                            : isIncomp
                                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                            : isRech
                                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                    }`}
                                                                >
                                                                    {isVal && <CheckCircle2 className="h-3 w-3" />}
                                                                    {isIncomp && <AlertTriangle className="h-3 w-3" />}
                                                                    {isRech && <XCircle className="h-3 w-3" />}
                                                                    {!isVal && !isIncomp && !isRech && (
                                                                        <Clock className="h-3 w-3" />
                                                                    )}
                                                                    <span>{doc.estado || 'Pendiente'}</span>
                                                                </span>

                                                                {doc.comentario && (
                                                                    <p
                                                                        className="text-[10px] text-[#94a3b8] italic mt-1 max-w-[220px] truncate"
                                                                        title={doc.comentario}
                                                                    >
                                                                        Dictamen: {doc.comentario}
                                                                    </p>
                                                                )}
                                                            </td>

                                                            <td className="py-3.5 px-4 text-[#94a3b8] text-[11px]">
                                                                <div>Carga: {doc.fecha_carga || doc.created_at || 'Reciente'}</div>
                                                                {doc.fecha_validacion && (
                                                                    <div className="text-[10px] text-emerald-400/80">
                                                                        Auditado: {doc.fecha_validacion}
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td className="py-3.5 px-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {/* Botón Ver Preview */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setPreviewDoc(doc)}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white border border-[#334155] transition text-xs font-medium cursor-pointer"
                                                                        title="Visualizar soporte"
                                                                    >
                                                                        <Eye className="h-3 w-3 text-cyan-400" />
                                                                        <span>Ver</span>
                                                                    </button>

                                                                    {/* Botón Dictaminar / Validar (Tasks 3.2.3 & 3.2.5) */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setValidarDoc(doc)}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition text-xs font-semibold shadow shadow-blue-600/20 cursor-pointer"
                                                                        title="Aprobar, rechazar o solicitar corrección"
                                                                    >
                                                                        <Scale className="h-3 w-3" />
                                                                        <span>Dictaminar</span>
                                                                    </button>

                                                                    {/* Botón Descargar */}
                                                                    {doc.url && (
                                                                        <a
                                                                            href={doc.url}
                                                                            download={doc.nombre}
                                                                            className="p-1 rounded-lg bg-[#1e293b] hover:bg-blue-600 text-[#cbd5e1] hover:text-white border border-[#334155] transition text-xs"
                                                                            title="Descargar archivo"
                                                                        >
                                                                            <Download className="h-3 w-3" />
                                                                        </a>
                                                                    )}
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
                        </>
                    ) : (
                        <div className="p-12 text-center rounded-2xl bg-[#111827] border border-[#334155] space-y-3">
                            <FileCheck className="h-10 w-10 text-[#64748b] mx-auto" />
                            <h3 className="text-sm font-semibold text-white">
                                Seleccione una incapacidad
                            </h3>
                            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
                                Elija un caso de la lista lateral izquierda para auditar los soportes médicos y validar el cumplimiento del checklist.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Previsualización */}
            <DocumentPreviewModal
                isOpen={Boolean(previewDoc)}
                onClose={() => setPreviewDoc(null)}
                documento={previewDoc}
            />

            {/* Modal de Dictamen / Validación (Task 3.2.5) */}
            <ModalValidarDocumento
                isOpen={Boolean(validarDoc)}
                onClose={() => setValidarDoc(null)}
                documento={validarDoc}
                onValidated={handleDocumentValidated}
                onPreview={(doc) => {
                    setValidarDoc(null)
                    setPreviewDoc(doc)
                }}
            />

            {/* Modal de Carga de Soporte */}
            {isUploadModalOpen && selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111827] border border-[#334155] rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    <Upload className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        Cargar Soporte Médico
                                    </h3>
                                    <p className="text-xs text-[#94a3b8]">
                                        Incapacidad #{String(selectedId).padStart(4, '0')}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(false)}
                                className="p-1 rounded-lg text-[#94a3b8] hover:text-white transition cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <FileUploader
                            incapacidadId={selectedId}
                            availableTipos={requiredTipos}
                            defaultTipo={uploadDefaultTipo}
                            onSuccess={handleUploadSuccess}
                            onCancel={() => setIsUploadModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default function DocumentosPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <div className="h-16 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 h-96 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                        <div className="lg:col-span-8 h-96 rounded-2xl bg-[#111827] border border-[#334155] animate-pulse" />
                    </div>
                </div>
            }
        >
            <DocumentosContent />
        </Suspense>
    )
}

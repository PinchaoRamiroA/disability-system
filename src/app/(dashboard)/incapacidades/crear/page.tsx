'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck,
    FileText,
    Info,
    Loader2,
    Plus,
    Save,
    Shield,
    Sparkles,
    User,
    Users,
} from 'lucide-react'
import type { TipoIncapacidad, Entidad } from '@/contracts/incapacidades'
import type { User as UserContract } from '@/contracts/auth'
import {
    crearIncapacidad,
    getTipos,
    getEntidades,
} from '@/services/incapacidad.service'
import { getUsuarios } from '@/services/usuario.service'
import { useAuth } from '@/hooks/useAuth'

// Fallback lists if backend endpoints are not populated yet
const FALLBACK_TIPOS: TipoIncapacidad[] = [
    {
        id_tipo: 1,
        nombre: 'Incapacidad Médica General',
        documentos_requeridos: [
            'Certificado médico original con firma y registro médico',
            'Historia clínica o epicrisis de atención',
            'Fórmula médica o prescripción farmacológica',
        ],
    },
    {
        id_tipo: 2,
        nombre: 'Accidente de Trabajo',
        documentos_requeridos: [
            'FURAT (Informe de presunto accidente de trabajo)',
            'Certificado de atención inicial de urgencias',
            'Historia clínica de ingreso hospitalario',
        ],
    },
    {
        id_tipo: 3,
        nombre: 'Licencia de Maternidad',
        documentos_requeridos: [
            'Certificado de nacido vivo o registro civil de nacimiento',
            'Epicrisis del parto o cesárea',
            'Certificación médica con fecha probable de parto',
        ],
    },
    {
        id_tipo: 4,
        nombre: 'Licencia de Paternidad',
        documentos_requeridos: [
            'Registro civil de nacimiento del menor',
            'Cédula de ciudadanía de ambos padres',
            'Certificación de semanas cotizadas',
        ],
    },
    {
        id_tipo: 5,
        nombre: 'Prórroga de Incapacidad',
        documentos_requeridos: [
            'Certificado médico de prórroga con diagnóstico CIE-10 coincidente',
            'Incapacidad inicial previa',
            'Concepto médico del especialista tratante',
        ],
    },
]

const FALLBACK_ENTIDADES: Entidad[] = [
    { id_entidad: 1, nombre: 'EPS SURA', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual', 'email'], requiere_transcripcion: true },
    { id_entidad: 2, nombre: 'Sanitas EPS', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual', 'presencial'], requiere_transcripcion: true },
    { id_entidad: 3, nombre: 'Nueva EPS', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 60, canal_atencion: 'presencial', canales_atencion: ['presencial'], requiere_transcripcion: true },
    { id_entidad: 4, nombre: 'Salud Total', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
    { id_entidad: 5, nombre: 'Compensar EPS', tipo: 'EPS', plazo_transcripcion_dias: 30, tiempo_maximo_pago_dias: 45, canal_atencion: 'virtual', canales_atencion: ['virtual', 'presencial'], requiere_transcripcion: true },
    { id_entidad: 6, nombre: 'Positiva ARL', tipo: 'ARL', plazo_transcripcion_dias: 15, tiempo_maximo_pago_dias: 30, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
    { id_entidad: 7, nombre: 'SURA ARL', tipo: 'ARL', plazo_transcripcion_dias: 15, tiempo_maximo_pago_dias: 30, canal_atencion: 'virtual', canales_atencion: ['virtual'], requiere_transcripcion: true },
]

const FALLBACK_USUARIOS: UserContract[] = [
    {
        id: 1,
        nombre: 'Carlos Eduardo Ramírez',
        correo: 'carlos.ramirez@empresa.com',
        numero_documento: '1094882110',
        numero_celular: '3104558990',
        direccion: 'Cra 15 # 45-12',
        estado: true,
        rol: { id: 3, nombre: 'Empleado', permisos: [] },
        created_at: '2026-01-15T00:00:00Z',
    },
    {
        id: 2,
        nombre: 'María Camila Benítez',
        correo: 'maria.benitez@empresa.com',
        numero_documento: '52410998',
        numero_celular: '3158874123',
        direccion: 'Calle 100 # 19-40',
        estado: true,
        rol: { id: 3, nombre: 'Empleado', permisos: [] },
        created_at: '2026-02-10T00:00:00Z',
    },
    {
        id: 3,
        nombre: 'Jorge Andrés Martínez',
        correo: 'jorge.martinez@empresa.com',
        numero_documento: '1128400320',
        numero_celular: '3209981144',
        direccion: 'Av. El Dorado # 68-10',
        estado: true,
        rol: { id: 3, nombre: 'Empleado', permisos: [] },
        created_at: '2026-03-01T00:00:00Z',
    },
]

const ORIGENES = [
    { value: 'enfermedad_general', label: 'Enfermedad General (Común)' },
    { value: 'accidente_trabajo', label: 'Accidente de Trabajo (Laboral)' },
    { value: 'accidente_transito', label: 'Accidente de Tránsito (SOAT)' },
    { value: 'maternidad', label: 'Licencia de Maternidad' },
    { value: 'paternidad', label: 'Licencia de Paternidad' },
]

const CANALES_RECEPCION = [
    { value: 'virtual', label: 'Portal Web / Virtual' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'presencial', label: 'Radicación Presencial' },
    { value: 'fax', label: 'Fax Institucional' },
]

export default function CrearIncapacidadPage() {
    const router = useRouter()
    const { user } = useAuth()

    const canManageOthers = useMemo(() => {
        if (!user) return false
        const role = user.rol?.nombre || ''
        const allowedRoles = ['Administrador', 'admin', 'Gestión Humana', 'SG-SST', 'Recepcionista']
        if (allowedRoles.includes(role)) return true
        const permisos = user.rol?.permisos || []
        return permisos.includes('gestionar_usuarios') || permisos.includes('editar_incapacidad')
    }, [user])

    const [tipos, setTipos] = useState<TipoIncapacidad[]>([])
    const [entidades, setEntidades] = useState<Entidad[]>([])
    const [usuarios, setUsuarios] = useState<UserContract[]>([])
    const [registroModo, setRegistroModo] = useState<'propio' | 'colaborador'>('propio')
    const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true)
    const [serverError, setServerError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    // Load dynamic catalogs & users (only load users if canManageOthers to protect personal data)
    useEffect(() => {
        let isMounted = true
        async function loadCatalogs() {
            try {
                const fetchPromises: [Promise<TipoIncapacidad[]>, Promise<Entidad[]>, Promise<UserContract[]>] = [
                    getTipos(),
                    getEntidades(),
                    canManageOthers ? getUsuarios() : Promise.resolve([]),
                ]
                const [tiposData, entidadesData, usuariosData] = await Promise.all(fetchPromises)
                if (isMounted) {
                    setTipos(tiposData.length > 0 ? tiposData : FALLBACK_TIPOS)
                    setEntidades(entidadesData.length > 0 ? entidadesData : FALLBACK_ENTIDADES)
                    setUsuarios(canManageOthers && usuariosData.length > 0 ? usuariosData : (canManageOthers ? FALLBACK_USUARIOS : []))
                }
            } catch {
                if (isMounted) {
                    setTipos(FALLBACK_TIPOS)
                    setEntidades(FALLBACK_ENTIDADES)
                    setUsuarios(canManageOthers ? FALLBACK_USUARIOS : [])
                }
            } finally {
                if (isMounted) {
                    setIsLoadingCatalogs(false)
                }
            }
        }
        loadCatalogs()
        return () => {
            isMounted = false
        }
    }, [canManageOthers])

    // Initial dates generated safely inside useState lazy initializer
    const [initialDates] = useState(() => {
        const d = new Date()
        const todayStr = d.toISOString().split('T')[0]
        const nextDay = new Date(d.getTime() + 86400000)
        const tomorrowStr = nextDay.toISOString().split('T')[0]
        return { today: todayStr, tomorrow: tomorrowStr }
    })

    // Formik & Yup Setup (Task 2.2.2)
    const validationSchema = Yup.object().shape({
        id_usuario: Yup.number()
            .positive('Seleccione un colaborador válido')
            .required('El colaborador es obligatorio'),
        titulo: Yup.string()
            .min(3, 'El diagnóstico o título debe tener al menos 3 caracteres')
            .required('El título o diagnóstico es obligatorio'),
        id_tipo: Yup.number()
            .positive('Seleccione un tipo de incapacidad válido')
            .required('El tipo de incapacidad es obligatorio'),
        id_entidad: Yup.number()
            .positive('Seleccione una entidad válida')
            .required('La entidad (EPS / ARL) es obligatoria'),
        origen: Yup.string().required('El origen de la contingencia es obligatorio'),
        canal_recepcion: Yup.string().required('El canal de recepción es obligatorio'),
        fecha_inicio: Yup.string().required('La fecha de inicio es obligatoria'),
        fecha_fin: Yup.string()
            .required('La fecha de finalización es obligatoria')
            .test(
                'is-after-or-equal',
                'La fecha de finalización no puede ser anterior a la fecha de inicio',
                function (value) {
                    const { fecha_inicio } = this.parent
                    if (!fecha_inicio || !value) return true
                    return new Date(value) >= new Date(fecha_inicio)
                }
            ),
        observaciones: Yup.string().nullable(),
        fecha_radicacion: Yup.string().nullable(),
    })

    const formik = useFormik({
        initialValues: {
            id_usuario: user?.id || 1,
            titulo: '',
            id_tipo: 1,
            id_entidad: 1,
            origen: 'enfermedad_general',
            canal_recepcion: 'virtual',
            fecha_inicio: initialDates.today,
            fecha_fin: initialDates.tomorrow,
            fecha_radicacion: initialDates.today,
            observaciones: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError(null)
            try {
                await crearIncapacidad({
                    id_usuario: Number(values.id_usuario),
                    id_tipo: Number(values.id_tipo),
                    id_entidad: Number(values.id_entidad),
                    titulo: values.titulo.trim(),
                    fecha_inicio: values.fecha_inicio,
                    fecha_fin: values.fecha_fin,
                    origen: values.origen,
                    canal_recepcion: values.canal_recepcion,
                    fecha_radicacion: values.fecha_radicacion || undefined,
                    observaciones: values.observaciones?.trim() || undefined,
                })

                setIsSuccess(true)
                setTimeout(() => {
                    router.push('/incapacidades')
                }, 1500)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setServerError(err.message)
                } else {
                    setServerError('Ocurrió un error inesperado al registrar la incapacidad.')
                }
            } finally {
                setSubmitting(false)
            }
        },
    })

    // Sincronizar id_usuario con el usuario autenticado cuando no tiene permisos de gestionar terceros
    useEffect(() => {
        if (user?.id && (!canManageOthers || registroModo === 'propio')) {
            formik.setFieldValue('id_usuario', user.id)
        }
    }, [user?.id, canManageOthers, registroModo])

    const handleModoChange = (modo: 'propio' | 'colaborador') => {
        if (!canManageOthers) return
        setRegistroModo(modo)
        if (modo === 'propio') {
            formik.setFieldValue('id_usuario', user?.id || 1)
        } else if (usuarios.length > 0) {
            formik.setFieldValue('id_usuario', usuarios[0].id)
        }
    }

    // Calculate total calendar days dynamically (Task 2.2.6)
    const calculateDays = () => {
        if (!formik.values.fecha_inicio || !formik.values.fecha_fin) return 0
        const start = new Date(formik.values.fecha_inicio)
        const end = new Date(formik.values.fecha_fin)
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
        if (end < start) return -1
        const diffTime = end.getTime() - start.getTime()
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const totalDays = calculateDays()

    // Presets for quick day additions (Task 2.2.5)
    const applyDurationPreset = (daysToAdd: number) => {
        const start = new Date(formik.values.fecha_inicio || initialDates.today)
        if (isNaN(start.getTime())) return
        const end = new Date(start.getTime() + (daysToAdd - 1) * 86400000)
        formik.setFieldValue('fecha_fin', end.toISOString().split('T')[0])
    }

    // Selected metadata for side assistance panel
    const selectedTipo = tipos.find((t) => t.id_tipo === Number(formik.values.id_tipo))
    const selectedEntidad = entidades.find((e) => e.id_entidad === Number(formik.values.id_entidad))
    const selectedUserId = Number(formik.values.id_usuario)
    const selectedUser =
        registroModo === 'propio'
            ? user
            : usuarios.find((u) => u.id === selectedUserId) || user

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
            {/* Breadcrumb & Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155]/60 pb-5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                        <Link href="/incapacidades" className="hover:text-blue-400 transition">
                            Incapacidades
                        </Link>
                        <span>/</span>
                        <span className="text-white font-medium">Nueva Radicación</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                        <Plus className="h-6 w-6 text-blue-500" />
                        <span>Radicar Nueva Incapacidad</span>
                    </h1>
                    <p className="text-xs text-[#94a3b8]">
                        Diligencia la información clínica y administrativa del expediente médico para validación y cobro.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/incapacidades"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-xs font-semibold text-[#cbd5e1] hover:text-white border border-[#334155] transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Volver al Listado</span>
                    </Link>
                </div>
            </div>

            {/* Notification Banner on Success */}
            {isSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-sm text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0 animate-bounce" />
                    <div>
                        <span className="font-semibold">¡Incapacidad registrada exitosamente!</span>
                        <p className="text-xs text-emerald-300/90 mt-0.5">
                            Redirigiendo a la bandeja principal de incapacidades...
                        </p>
                    </div>
                </div>
            )}

            {/* Server Error Alert */}
            {serverError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-sm text-red-300">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold">Error al radicar la incapacidad:</span>
                        <p className="text-xs mt-0.5">{serverError}</p>
                    </div>
                </div>
            )}

            {/* Main Form Grid */}
            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Block 1: Colaborador / Paciente Titular */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60 text-white font-semibold text-sm">
                            <div className="flex items-center gap-2.5">
                                <Users className="h-4 w-4 text-cyan-400" />
                                <span>1. Colaborador / Paciente Afectado</span>
                            </div>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {!canManageOthers
                                    ? 'Auto-radicación personal'
                                    : (registroModo === 'propio' ? 'Auto-radicación' : 'Radicación por Delegación')}
                            </span>
                        </div>

                        {/* Modo Selector (Solo administradores y gestores autorizados) */}
                        {canManageOthers && (
                            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0f172a] border border-[#334155]">
                                <button
                                    type="button"
                                    onClick={() => handleModoChange('propio')}
                                    className={`py-2 text-xs font-semibold rounded-lg transition ${
                                        registroModo === 'propio'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-[#94a3b8] hover:text-white'
                                    }`}
                                >
                                    Registrar a mi nombre
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModoChange('colaborador')}
                                    className={`py-2 text-xs font-semibold rounded-lg transition ${
                                        registroModo === 'colaborador'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-[#94a3b8] hover:text-white'
                                    }`}
                                >
                                    Registrar para un Colaborador
                                </button>
                            </div>
                        )}

                        {(!canManageOthers || registroModo === 'propio') ? (
                            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <span className="text-xs text-[#94a3b8] block">Colaborador en sesión:</span>
                                    <span className="text-sm font-bold text-white block">
                                        {user?.nombre || 'Usuario Autenticado'}
                                    </span>
                                    <span className="text-xs text-[#cbd5e1] block">
                                        Documento: {user?.numero_documento || 'No registrado'} • {user?.correo || ''}
                                    </span>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">
                                    Titular del Expediente
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                        Selecciona el Colaborador de la Empresa <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="id_usuario"
                                        value={formik.values.id_usuario || ''}
                                        onChange={(e) => {
                                            formik.setFieldValue('id_usuario', Number(e.target.value))
                                        }}
                                        disabled={isLoadingCatalogs}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-[#111827] text-[#94a3b8]">
                                            -- Seleccionar colaborador registrado en el sistema --
                                        </option>
                                        {usuarios.map((u) => (
                                            <option key={u.id} value={u.id} className="bg-[#111827] text-white">
                                                [CC {u.numero_documento}] {u.nombre} — {u.correo}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[11px] text-[#94a3b8] mt-1.5">
                                        El colaborador debe existir previamente en la base de datos de usuarios para garantizar la trazabilidad legal.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Block 2: Diagnóstico y Título */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-[#334155]/60 text-white font-semibold text-sm">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span>2. Información del Diagnóstico</span>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                Título o Diagnóstico Clínico <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formik.values.titulo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Ej: M54.5 - Lumbago agudo por esfuerzo mecánico"
                                className={`w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border text-sm text-white placeholder-[#94a3b8] focus:outline-none transition ${
                                    formik.touched.titulo && formik.errors.titulo
                                        ? 'border-red-500 ring-1 ring-red-500'
                                        : 'border-[#334155] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                }`}
                            />
                            {formik.touched.titulo && formik.errors.titulo && (
                                <p className="text-[11px] text-red-400 mt-1">{formik.errors.titulo}</p>
                            )}
                            <p className="text-[11px] text-[#94a3b8] mt-1">
                                Especifica el diagnóstico CIE-10 o motivo principal indicado en el certificado médico.
                            </p>
                        </div>
                    </div>

                    {/* Block 3: Clasificación y Entidades (Task 2.2.4) */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-5">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-[#334155]/60 text-white font-semibold text-sm">
                            <Building2 className="h-4 w-4 text-emerald-400" />
                            <span>3. Clasificación & Entidad Pagadora</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Tipo de Incapacidad Select */}
                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Tipo de Incapacidad <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="id_tipo"
                                    value={formik.values.id_tipo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isLoadingCatalogs}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                                >
                                    {tipos.map((t) => (
                                        <option key={t.id_tipo} value={t.id_tipo} className="bg-[#111827] text-white">
                                            {t.nombre}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.id_tipo && formik.errors.id_tipo && (
                                    <p className="text-[11px] text-red-400 mt-1">{formik.errors.id_tipo}</p>
                                )}
                            </div>

                            {/* Origen Select */}
                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Origen de la Contingencia <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="origen"
                                    value={formik.values.origen}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                                >
                                    {ORIGENES.map((o) => (
                                        <option key={o.value} value={o.value} className="bg-[#111827] text-white">
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Entidad (EPS / ARL) Select */}
                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Entidad Responsable (EPS / ARL) <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="id_entidad"
                                    value={formik.values.id_entidad}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isLoadingCatalogs}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                                >
                                    {entidades.map((e) => (
                                        <option key={e.id_entidad} value={e.id_entidad} className="bg-[#111827] text-white">
                                            [{e.tipo}] {e.nombre}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.id_entidad && formik.errors.id_entidad && (
                                    <p className="text-[11px] text-red-400 mt-1">{formik.errors.id_entidad}</p>
                                )}
                            </div>

                            {/* Canal de Recepción */}
                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Canal de Recepción <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="canal_recepcion"
                                    value={formik.values.canal_recepcion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                                >
                                    {CANALES_RECEPCION.map((c) => (
                                        <option key={c.value} value={c.value} className="bg-[#111827] text-white">
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Block 4: Período y Fechas (Task 2.2.5 & 2.2.6) */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60">
                            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                                <Calendar className="h-4 w-4 text-cyan-400" />
                                <span>4. Período de Incapacidad & Fechas</span>
                            </div>

                            {/* Duration Presets */}
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#94a3b8]">
                                <span className="text-[11px] mr-1">Rápido:</span>
                                {[1, 3, 5, 15, 30].map((days) => (
                                    <button
                                        key={days}
                                        type="button"
                                        onClick={() => applyDurationPreset(days)}
                                        className="px-2 py-0.5 rounded-md bg-[#1e293b] hover:bg-blue-600 hover:text-white border border-[#334155] transition text-[11px]"
                                    >
                                        +{days}d
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Fecha de Inicio <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_inicio"
                                    value={formik.values.fecha_inicio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                                {formik.touched.fecha_inicio && formik.errors.fecha_inicio && (
                                    <p className="text-[11px] text-red-400 mt-1">{formik.errors.fecha_inicio}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Fecha de Finalización <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_fin"
                                    value={formik.values.fecha_fin}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border text-sm text-white focus:outline-none transition ${
                                        formik.touched.fecha_fin && formik.errors.fecha_fin
                                            ? 'border-red-500 ring-1 ring-red-500'
                                            : 'border-[#334155] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    }`}
                                />
                                {formik.touched.fecha_fin && formik.errors.fecha_fin && (
                                    <p className="text-[11px] text-red-400 mt-1">{formik.errors.fecha_fin}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                    Fecha Radicación Interna
                                </label>
                                <input
                                    type="date"
                                    name="fecha_radicacion"
                                    value={formik.values.fecha_radicacion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>

                        {/* Interactive Days and Legal Coverage Banner (Task 2.2.6) */}
                        <div className="mt-4 p-4 rounded-xl bg-[#0f172a] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 shrink-0">
                                    <span className="text-lg font-bold leading-none">
                                        {totalDays > 0 ? totalDays : 0}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-wider font-semibold">
                                        Días
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-white">
                                        Duración Total Calculada
                                    </span>
                                    <p className="text-xs text-[#cbd5e1] mt-0.5">
                                        {totalDays === 1
                                            ? 'Incapacidad de 1 día hábil/calendario.'
                                            : totalDays > 1
                                            ? `Incapacidad de ${totalDays} días continuos.`
                                            : 'Fecha de fin inválida o anterior a fecha de inicio.'}
                                    </p>
                                </div>
                            </div>

                            {/* Responsibility Pill based on Colombian Law */}
                            <div className="sm:text-right">
                                <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium block">
                                    Responsable Económico
                                </span>
                                {totalDays <= 2 && totalDays > 0 && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 mt-1">
                                        <Shield className="h-3 w-3" />
                                        Empleador (Días 1-2)
                                    </span>
                                )}
                                {totalDays > 2 && totalDays <= 180 && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 mt-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {formik.values.origen === 'accidente_trabajo'
                                            ? 'ARL (100% Salario)'
                                            : 'EPS (A partir del día 3)'}
                                    </span>
                                )}
                                {totalDays > 180 && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Fondo de Pensiones (&gt;180d)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Block 5: Observaciones */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 space-y-3">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-[#334155]/60 text-white font-semibold text-sm">
                            <Info className="h-4 w-4 text-purple-400" />
                            <span>5. Observaciones Médicas o de Gestión</span>
                        </div>
                        <textarea
                            name="observaciones"
                            rows={3}
                            value={formik.values.observaciones}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Añade cualquier nota clínica relevante, número de prescripción médica o instrucciones especiales para radicación..."
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                        />
                    </div>

                    {/* Submission Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href="/incapacidades"
                            className="px-5 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-[#cbd5e1] hover:text-white border border-[#334155] text-sm font-semibold transition"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting || totalDays <= 0}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition active:scale-[0.98] cursor-pointer"
                        >
                            {formik.isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Guardando e Indexando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Crear Incapacidad</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right 1 Column: Clinical Assistance & Requirements Panel */}
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-5 space-y-4">
                        <div className="flex items-center gap-2 text-white font-semibold text-sm">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <span>Resumen del Expediente</span>
                        </div>

                        <div className="space-y-3 text-xs divide-y divide-[#334155]/60">
                            <div className="pt-1">
                                <span className="text-[#94a3b8] block">Colaborador Titular:</span>
                                <span className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                                    <User className="h-3.5 w-3.5 text-blue-400" />
                                    {selectedUser?.nombre || 'No seleccionado'}
                                </span>
                                {selectedUser?.numero_documento && (
                                    <span className="text-[11px] text-[#cbd5e1] block mt-0.5">
                                        Documento: {selectedUser.numero_documento}
                                    </span>
                                )}
                            </div>

                            <div className="pt-2">
                                <span className="text-[#94a3b8] block">Radicado por (Operador):</span>
                                <span className="font-medium text-[#cbd5e1] flex items-center gap-1.5 mt-0.5">
                                    {user?.nombre || 'Usuario Autorizado'}
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        {user?.rol?.nombre || 'Admin'}
                                    </span>
                                </span>
                            </div>

                            <div className="pt-2">
                                <span className="text-[#94a3b8] block">Entidad Destino:</span>
                                <span className="font-medium text-white mt-0.5 block">
                                    {selectedEntidad ? `${selectedEntidad.nombre} (${selectedEntidad.tipo})` : 'Sin seleccionar'}
                                </span>
                                {selectedEntidad && (
                                    <span className="text-[11px] text-blue-400 block mt-0.5">
                                        Término de transcripción: {selectedEntidad.plazo_transcripcion_dias} días
                                    </span>
                                )}
                            </div>

                            <div className="pt-2">
                                <span className="text-[#94a3b8] block">Tipo de Incapacidad:</span>
                                <span className="font-medium text-white mt-0.5 block">
                                    {selectedTipo?.nombre || 'General'}
                                </span>
                            </div>

                            <div className="pt-2">
                                <span className="text-[#94a3b8] block">Canal Seleccionado:</span>
                                <span className="font-medium text-white capitalize mt-0.5 block">
                                    {formik.values.canal_recepcion}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Required Documents Checklist Card (Task 2.2.4) */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                                <FileCheck className="h-4 w-4 text-emerald-400" />
                                <span>Checklist Documental Exigido</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                Prioridad 3
                            </span>
                        </div>

                        <p className="text-xs text-[#cbd5e1] leading-relaxed">
                            Una vez creada la incapacidad, se deberán anexar los siguientes soportes para su validación documental ante {selectedEntidad?.nombre || 'la EPS'}:
                        </p>

                        <div className="space-y-2 pt-2">
                            {selectedTipo?.documentos_requeridos && selectedTipo.documentos_requeridos.length > 0 ? (
                                selectedTipo.documentos_requeridos.map((doc, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] flex items-start gap-2.5 text-xs text-[#cbd5e1]"
                                    >
                                        <div className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <span>{doc}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-[#94a3b8] italic">
                                    No se requieren documentos adicionales para esta categoría.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Legal Reminders Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#111827] to-[#1e293b] border border-[#334155] p-5 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                            <Clock className="h-4 w-4" />
                            <span>Normativa de Radicación en Colombia</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] leading-relaxed">
                            El colaborador tiene hasta <strong>2 días hábiles</strong> posteriores al hecho para allegar el certificado a talento humano. La empresa cuenta con el plazo establecido por la EPS (habitualmente <strong>15 a 30 días calendario</strong>) para radicar la transcripción legal.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}

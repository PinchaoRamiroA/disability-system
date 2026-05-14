import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import { ApiResponse, PaginatedData } from '@/types/api'
import { HistorialIncapacidad } from '@/types/api'

export interface AuditoriaFilters {
	id_usuario?: number
	id_incapacidad?: number
	tipo_accion?: string
	modulo?: string
	fecha_inicio?: string
	fecha_fin?: string
	page?: number
	limit?: number
}

export interface AuditoriaEntry {
	id_auditoria: number
	id_usuario?: number
	usuario_nombre?: string
	id_incapacidad?: number
	tipo_accion: string
	modulo: string
	descripcion: string
	cambio_anterior?: string
	cambio_nuevo?: string
	ip_address?: string
	user_agent?: string
	created_at: string
}

export const getAuditoria = async (
	filters: AuditoriaFilters = {}
): Promise<AxiosResponse<ApiResponse<PaginatedData<AuditoriaEntry>>>> => {
	const params = new URLSearchParams()
	if (filters.id_usuario) params.append('id_usuario', filters.id_usuario.toString())
	if (filters.id_incapacidad) params.append('id_incapacidad', filters.id_incapacidad.toString())
	if (filters.tipo_accion) params.append('tipo_accion', filters.tipo_accion)
	if (filters.modulo) params.append('modulo', filters.modulo)
	if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio)
	if (filters.fecha_fin) params.append('fecha_fin', filters.fecha_fin)
	if (filters.page) params.append('page', filters.page.toString())
	if (filters.limit) params.append('limit', filters.limit.toString())

	return orchestratorWithAuthClient.get(`/auditoria?${params.toString()}`)
}

export const getAuditoriaByIncapacidad = async (
	idIncapacidad: number
): Promise<AxiosResponse<ApiResponse<HistorialIncapacidad[]>>> => {
	return orchestratorWithAuthClient.get(`/incapacidades/${idIncapacidad}/historial`)
}

export const getAuditoriaByUsuario = async (
	idUsuario: number
): Promise<AxiosResponse<ApiResponse<PaginatedData<AuditoriaEntry>>>> => {
	return orchestratorWithAuthClient.get(`/auditoria/usuario/${idUsuario}`)
}

export const TIPO_ACCIONES = [
	{ value: 'crear', label: 'Crear' },
	{ value: 'actualizar', label: 'Actualizar' },
	{ value: 'eliminar', label: 'Eliminar' },
	{ value: 'cambiar_estado', label: 'Cambiar Estado' },
	{ value: 'validar', label: 'Validar' },
	{ value: 'rechazar', label: 'Rechazar' },
	{ value: 'subir_documento', label: 'Subir Documento' },
	{ value: 'transcribir', label: 'Transcribir' },
	{ value: 'registrar_pago', label: 'Registrar Pago' },
	{ value: 'conciliar', label: 'Conciliar' },
]

export const MODULOS = [
	{ value: 'incapacidad', label: 'Incapacidades' },
	{ value: 'documento', label: 'Documentos' },
	{ value: 'pago', label: 'Pagos' },
	{ value: 'usuario', label: 'Usuarios' },
	{ value: 'transcripcion', label: 'Transcripción' },
]
import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import {
	ApiResponse,
	Incapacidad,
	IncapacidadFilters,
	CreateIncapacidadRequest,
	ChangeEstadoIncapacidadRequest,
	HistorialIncapacidad,
	PlazosIncapacidad,
	EstadoIncapacidad,
	TipoIncapacidad,
	Entidad,
	Documento,
	DocumentoFilters,
	CreateDocumentoRequest,
	ValidarDocumentoRequest,
} from '@/types/api'
import { PaginatedData } from '@/types/api'

export const getIncapacidades = async (
	filters: IncapacidadFilters = {}
): Promise<AxiosResponse<ApiResponse<PaginatedData<Incapacidad>>>> => {
	const params = new URLSearchParams()
	if (filters.id_estado) params.append('id_estado', filters.id_estado.toString())
	if (filters.id_tipo) params.append('id_tipo', filters.id_tipo.toString())
	if (filters.id_entidad) params.append('id_entidad', filters.id_entidad.toString())
	if (filters.origen) params.append('origen', filters.origen)
	if (filters.canal_recepcion)
		params.append('canal_recepcion', filters.canal_recepcion)
	if (filters.page) params.append('page', filters.page.toString())
	if (filters.limit) params.append('limit', filters.limit.toString())

	return orchestratorWithAuthClient.get(`/incapacidades?${params.toString()}`)
}

export const getIncapacidadById = async (
	id: number
): Promise<AxiosResponse<ApiResponse<Incapacidad>>> => {
	return orchestratorWithAuthClient.get(`/incapacidades/${id}`)
}

export const createIncapacidad = async (
	data: CreateIncapacidadRequest
): Promise<AxiosResponse<ApiResponse<Incapacidad>>> => {
	return orchestratorWithAuthClient.post('/incapacidades', data)
}

export const updateIncapacidad = async (
	id: number,
	data: Partial<CreateIncapacidadRequest>
): Promise<AxiosResponse<ApiResponse<Incapacidad>>> => {
	return orchestratorWithAuthClient.put(`/incapacidades/${id}`, data)
}

export const deleteIncapacidad = async (
	id: number
): Promise<AxiosResponse<ApiResponse<void>>> => {
	return orchestratorWithAuthClient.delete(`/incapacidades/${id}`)
}

export const changeIncapacidadEstado = async (
	id: number,
	data: ChangeEstadoIncapacidadRequest
): Promise<AxiosResponse<ApiResponse<Incapacidad>>> => {
	return orchestratorWithAuthClient.patch(`/incapacidades/${id}/estado`, data)
}

export const getIncapacidadHistorial = async (
	id: number
): Promise<AxiosResponse<ApiResponse<HistorialIncapacidad[]>>> => {
	return orchestratorWithAuthClient.get(`/incapacidades/${id}/historial`)
}

export const getIncapacidadPlazos = async (
	id: number
): Promise<AxiosResponse<ApiResponse<PlazosIncapacidad>>> => {
	return orchestratorWithAuthClient.get(`/incapacidades/${id}/plazos`)
}

export const getEstadosIncapacidad = async (): Promise<
	AxiosResponse<ApiResponse<EstadoIncapacidad[]>>
> => {
	return orchestratorWithAuthClient.get('/incapacidades/estados')
}

export const getTiposIncapacidad = async (): Promise<
	AxiosResponse<ApiResponse<TipoIncapacidad[]>>
> => {
	return orchestratorWithAuthClient.get('/incapacidades/tipos')
}

export const getEntidades = async (): Promise<
	AxiosResponse<ApiResponse<Entidad[]>>
> => {
	return orchestratorWithAuthClient.get('/incapacidades/entidades')
}

export const getDocumentosRequeridos = async (
	idTipo: number
): Promise<AxiosResponse<ApiResponse<string[]>>> => {
	return orchestratorWithAuthClient.get(
		`/incapacidades/tipos/${idTipo}/documentos-requeridos`
	)
}

export const getIncapacidadDocumentos = async (
	idIncapacidad: number,
	filters?: DocumentoFilters
): Promise<AxiosResponse<ApiResponse<PaginatedData<Documento>>>> => {
	const params = new URLSearchParams()
	params.append('id_incapacidad', idIncapacidad.toString())
	if (filters?.estado) params.append('estado', filters.estado)
	if (filters?.tipo) params.append('tipo', filters.tipo)
	if (filters?.page) params.append('page', filters.page.toString())
	if (filters?.limit) params.append('limit', filters.limit.toString())

	return orchestratorWithAuthClient.get(`/incapacidades/${idIncapacidad}/documentos?${params.toString()}`)
}

export const createDocumento = async (
	data: CreateDocumentoRequest
): Promise<AxiosResponse<ApiResponse<Documento>>> => {
	return orchestratorWithAuthClient.post(
		`/incapacidades/${data.id_incapacidad}/documentos`,
		data
	)
}

export const validarDocumento = async (
	id: number,
	data: ValidarDocumentoRequest
): Promise<AxiosResponse<ApiResponse<Documento>>> => {
	return orchestratorWithAuthClient.patch(`/documentos/${id}/validar`, data)
}

export const deleteDocumento = async (
	id: number
): Promise<AxiosResponse<ApiResponse<void>>> => {
	return orchestratorWithAuthClient.delete(`/documentos/${id}`)
}

export const transcribirIncapacidad = async (
	id: number,
	data: { fecha_transcripcion: string; numero_radicado: string; observaciones?: string }
): Promise<AxiosResponse<ApiResponse<Incapacidad>>> => {
	return orchestratorWithAuthClient.post(`/incapacidades/${id}/transcribir`, data)
}

export const updateTranscripcion = async (
	id: number,
	data: { estado_transcripcion: string }
): Promise<AxiosResponse<ApiResponse<Incapacidad>>> => {
	return orchestratorWithAuthClient.patch(`/incapacidades/${id}/transcripcion`, data)
}

export const getTranscripcionesPendientes = async (
	filters?: { estado?: string; page?: number; limit?: number }
): Promise<AxiosResponse<ApiResponse<{ items: Incapacidad[]; total: number; page: number; total_pages: number }>>> => {
	const params = new URLSearchParams()
	if (filters?.estado) params.append('estado', filters.estado)
	if (filters?.page) params.append('page', filters.page.toString())
	if (filters?.limit) params.append('limit', filters.limit.toString())
	return orchestratorWithAuthClient.get(`/incapacidades/transcripciones/pendientes?${params.toString()}`)
}
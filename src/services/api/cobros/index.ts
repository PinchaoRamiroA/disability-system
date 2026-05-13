import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import {
	ApiResponse,
	Pago,
	PagoFilters,
	CreatePagoRequest,
	UpdatePagoRequest,
	ConciliarPagoRequest,
	SeguimientoCobro,
	SeguimientoFilters,
	CreateSeguimientoRequest,
} from '@/types/api'
import { PaginatedData } from '@/types/api'

export const getPagos = async (
	filters: PagoFilters = {}
): Promise<AxiosResponse<ApiResponse<PaginatedData<Pago>>>> => {
	const params = new URLSearchParams()
	if (filters.id_incapacidad)
		params.append('id_incapacidad', filters.id_incapacidad.toString())
	if (filters.id_entidad)
		params.append('id_entidad', filters.id_entidad.toString())
	if (filters.tipo_pago) params.append('tipo_pago', filters.tipo_pago)
	if (filters.estado_pago) params.append('estado_pago', filters.estado_pago)
	if (filters.conciliado !== undefined)
		params.append('conciliado', filters.conciliado.toString())
	if (filters.page) params.append('page', filters.page.toString())
	if (filters.limit) params.append('limit', filters.limit.toString())

	return orchestratorWithAuthClient.get(`/cobros/pagos?${params.toString()}`)
}

export const getPagoById = async (
	id: number
): Promise<AxiosResponse<ApiResponse<Pago>>> => {
	return orchestratorWithAuthClient.get(`/cobros/pagos/${id}`)
}

export const createPago = async (
	data: CreatePagoRequest
): Promise<AxiosResponse<ApiResponse<Pago>>> => {
	return orchestratorWithAuthClient.post('/cobros/pagos', data)
}

export const updatePago = async (
	id: number,
	data: UpdatePagoRequest
): Promise<AxiosResponse<ApiResponse<Pago>>> => {
	return orchestratorWithAuthClient.put(`/cobros/pagos/${id}`, data)
}

export const deletePago = async (
	id: number
): Promise<AxiosResponse<ApiResponse<void>>> => {
	return orchestratorWithAuthClient.delete(`/cobros/pagos/${id}`)
}

export const reconcilePago = async (
	id: number,
	data: ConciliarPagoRequest
): Promise<AxiosResponse<ApiResponse<Pago>>> => {
	return orchestratorWithAuthClient.patch(`/cobros/pagos/${id}/conciliar`, data)
}

export const getSeguimientos = async (
	filters: SeguimientoFilters = {}
): Promise<AxiosResponse<ApiResponse<PaginatedData<SeguimientoCobro>>>> => {
	const params = new URLSearchParams()
	if (filters.id_incapacidad)
		params.append('id_incapacidad', filters.id_incapacidad.toString())
	if (filters.tipo_seguimiento)
		params.append('tipo_seguimiento', filters.tipo_seguimiento)
	if (filters.page) params.append('page', filters.page.toString())
	if (filters.limit) params.append('limit', filters.limit.toString())

	return orchestratorWithAuthClient.get(
		`/cobros/seguimientos?${params.toString()}`
	)
}

export const getSeguimientoById = async (
	id: number
): Promise<AxiosResponse<ApiResponse<SeguimientoCobro>>> => {
	return orchestratorWithAuthClient.get(`/cobros/seguimientos/${id}`)
}

export const createSeguimiento = async (
	data: CreateSeguimientoRequest
): Promise<AxiosResponse<ApiResponse<SeguimientoCobro>>> => {
	return orchestratorWithAuthClient.post('/cobros/seguimientos', data)
}

export const updateSeguimiento = async (
	id: number,
	data: Partial<CreateSeguimientoRequest>
): Promise<AxiosResponse<ApiResponse<SeguimientoCobro>>> => {
	return orchestratorWithAuthClient.put(`/cobros/seguimientos/${id}`, data)
}
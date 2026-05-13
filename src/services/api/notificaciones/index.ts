import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import {
	ApiResponse,
	Notificacion,
	NotificacionFilters,
	CountNoLeidas,
} from '@/types/api'
import { PaginatedData } from '@/types/api'

export const getNotificaciones = async (
	filters: NotificacionFilters = {}
): Promise<AxiosResponse<ApiResponse<PaginatedData<Notificacion>>>> => {
	const params = new URLSearchParams()
	if (filters.leida !== undefined)
		params.append('leida', filters.leida.toString())
	if (filters.page) params.append('page', filters.page.toString())
	if (filters.limit) params.append('limit', filters.limit.toString())

	return orchestratorWithAuthClient.get(
		`/notificaciones?${params.toString()}`
	)
}

export const markNotificacionAsRead = async (
	id: number
): Promise<AxiosResponse<ApiResponse<Notificacion>>> => {
	return orchestratorWithAuthClient.patch(`/notificaciones/${id}/leida`)
}

export const markAllNotificacionesAsRead = async (): Promise<
	AxiosResponse<ApiResponse<{ mensaje: string }>>
> => {
	return orchestratorWithAuthClient.patch('/notificaciones/marcar-todas-leidas')
}

export const getCountNotificacionesNoLeidas = async (): Promise<
	AxiosResponse<ApiResponse<CountNoLeidas>>
> => {
	return orchestratorWithAuthClient.get('/notificaciones/no-leidas/count')
}
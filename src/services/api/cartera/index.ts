import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import {
	ApiResponse,
	CarteraEstadisticas,
	ResumenEntidad,
	CarteraVencida,
	AlertaVencimiento,
	AlertasVencimientoFilters,
	ReporteData,
	GenerateReporteRequest,
} from '@/types/api'
import { PaginatedData } from '@/types/api'

export const getCarteraEstadisticas = async (): Promise<
	AxiosResponse<ApiResponse<CarteraEstadisticas>>
> => {
	return orchestratorWithAuthClient.get('/cartera/estadisticas')
}

export const getResumenEntidad = async (): Promise<
	AxiosResponse<ApiResponse<ResumenEntidad[]>>
> => {
	return orchestratorWithAuthClient.get('/cartera/resumen-entidad')
}

export const getCarteraVencida = async (): Promise<
	AxiosResponse<ApiResponse<CarteraVencida[]>>
> => {
	return orchestratorWithAuthClient.get('/cartera/vencida')
}

export const getAlertasVencimiento = async (
	filters: AlertasVencimientoFilters = {}
): Promise<AxiosResponse<ApiResponse<AlertaVencimiento[]>>> => {
	const params = new URLSearchParams()
	if (filters.dias_minimos)
		params.append('dias_minimos', filters.dias_minimos.toString())

	return orchestratorWithAuthClient.get(
		`/cartera/alertas-vencimiento?${params.toString()}`
	)
}

export const getProximoEstado = async (
	idIncapacidad: number
): Promise<AxiosResponse<ApiResponse<{ id_estado: number; nombre: string }>>> => {
	return orchestratorWithAuthClient.get(
		`/cartera/incapacidades/${idIncapacidad}/proximo-estado`
	)
}

export const generateReporte = async (
	data: GenerateReporteRequest
): Promise<AxiosResponse<ApiResponse<ReporteData>>> => {
	return orchestratorWithAuthClient.post('/reportes', data)
}

export const getResumenEjecutivo = async (): Promise<
	AxiosResponse<ApiResponse<{
		incapacidades_activas: number
		pendientes: number
		pagadas: number
		rechazadas: number
		total_cartera: string
		total_pagado: string
		alertas_vencimiento: number
	}>>
> => {
	return orchestratorWithAuthClient.get('/reportes/resumen-ejecutivo')
}

export const getReporteVencimientos = async (): Promise<
	AxiosResponse<ApiResponse<CarteraVencida[]>>
> => {
	return orchestratorWithAuthClient.get('/reportes/vencimientos')
}
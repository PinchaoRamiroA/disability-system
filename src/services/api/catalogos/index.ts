import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import { ApiResponse } from '@/types/api'

export interface TipoDocumento {
	id_tipo_documento: number
	nombre: string
	descripcion: string
	requerido: boolean
	codigo: string
}

export interface EstadoDocumento {
	id_estado_documento: number
	nombre: string
	descripcion: string
	color: string
}

export interface TipoPago {
	id_tipo_pago: number
	nombre: string
	descripcion: string
}

export const getTiposDocumento = async (): Promise<
	AxiosResponse<ApiResponse<TipoDocumento[]>>
> => {
	return orchestratorWithAuthClient.get('/catalogos/tipos-documento')
}

export const getEstadosDocumento = async (): Promise<
	AxiosResponse<ApiResponse<EstadoDocumento[]>>
> => {
	return orchestratorWithAuthClient.get('/catalogos/estados-documento')
}

export const getTiposPago = async (): Promise<
	AxiosResponse<ApiResponse<TipoPago[]>>
> => {
	return orchestratorWithAuthClient.get('/catalogos/tipos-pago')
}
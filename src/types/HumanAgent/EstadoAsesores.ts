import { DatesParams } from '../Filter/FilterParams'

export interface EstadoActual {
	idLogConexion: number
	idAsesor: number
	fechaConexion: string
	fechaDesconexion: null | string
	estado: Estados
	nombreAsesor: string
	email: string
	logEventoPausa: LogEventoPausa | null
}

export type Estados = 'Activo' | 'Inactivo' | 'Pausa'

export interface LogEventoPausa {
	[key: string]: string | number
	id: number | string
	idLogConnectionAgentHuman: string
	idPauseEvent: number
	pauseEventName: string
	startTime: string
	endTime: string
}

export interface EstadoHistorico {
	connections: Connection[]
	currentPage: number
	currentResults: number
	totalPages: number
	totalResult: number
}

export interface Connection {
	idLogConexion: number
	idAsesor: number
	fechaConexion: string
	fechaDesconexion: string
	estado: string
	nombreAsesor: string
	email: string
	logEventoPausa: LogEventoPausa
}

export interface EstadoHistoricoParams extends DatesParams {
	idOrg: number
	agents?: number[]
	splits?: number[]
	page?: number
	perPage?: number
}

/**
 * Filtros del servicio
 */
export interface AgentsChatsFilters {
	start: string
	end: string
	channels?: number[]
	splits?: number[]
}

/**
 * Parámetros del servicio
 */
export interface AgentsChatsParams {
	idOrg: number
	filters: AgentsChatsFilters
}

/**
 * Respuesta del servicio
 */
export interface AgentsChats {
	count: number
	detail?: AgentsChatsDetail[]
}

export interface AgentsChatsDetail {
	detail: DetailDetail[]
	idAdviser: number
	intent: string
}

interface DetailDetail {
	count: number
	idChannel: number
}

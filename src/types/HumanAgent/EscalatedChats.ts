/**
 * Filtros del servicio
 */
export interface EscalatedChatsFilters {
  start: string
  end: string
}

/**
 * Parámetros del servicio
 */
export interface EscalatedChatsParams {
  idOrg: number
  filters: EscalatedChatsFilters
}

/**
 * Respuesta del servicio
 */
export interface EscalatedChats {
  count: number
  detail?: EscalatedChatsDetail[]
}

export interface EscalatedChatsDetail {
  detail: Detail[]
  idAdviser: number
  intent: string
}

interface Detail {
  count: number
  idChannel: number
}

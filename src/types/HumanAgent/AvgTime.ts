/**
 * Filtros del servicio
 */
export interface AvgTimeFilters {
  start: string
  end: string
}

/**
 * Parámetros del servicio
 */
export interface AvgTimeParams {
  idOrg: number
  filters: AvgTimeFilters
}

/**
 * Respuesta del servicio
 */
export interface AvgTime {
  count: number
  detail?: AvgTimeDetail[]
}

export interface AvgTimeDetail {
  detail: DetailDetail[]
  intent: string
}

interface DetailDetail {
  count: number
  idChannel: number
}

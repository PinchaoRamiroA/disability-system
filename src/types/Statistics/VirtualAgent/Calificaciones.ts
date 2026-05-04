export type RatingsParams = {
	idOrg: number
	payload: {
		start: string
		end: string
		idVa: number
		channels?: number[]
	}
}

/**
 * Gráfica de calificaciones por intenciones en el tiempo
 */
export interface TopRating {
	count: number
	countFailed: number
	countSuccess: number
	detail: TopRatingDetail[]
}

export interface TopRatingDetail {
	detail: IntentDetails[]
	idRating: number
}

export interface IntentDetails {
	detail: {
		count: number
		idChannel: number
	}[]
	intent: string
}

export interface TopRatingChart {
	id: string
	value: number
	label: string
}

/**
 * Gráfica de calificaciones con intenciones en el tiempo
 */
export interface IntentsTimeRatingDeprecated {
	date: string
	details: { intent: string; positivo: number; negativo: number }[]
}
export interface IntentsTimeRating {
	date: string
	details: IntentsTimeRatingDetail[]
}

export interface IntentsTimeRatingDetail {
	intent: string
	rating1: number
	rating2: number
	rating3: number
	rating4: number
	rating5: number
	convs5: number[]
	convs4: number[]
	convs3: number[]
	convs2: number[]
	convs1: number[]
}

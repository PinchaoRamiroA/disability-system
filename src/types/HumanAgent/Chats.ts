import { DatesParams, LocationsParams } from '../Filter/FilterParams'

export interface OverallChats {
	data: OverallChatsDetails[]
	summary: Summary[]
}

export interface OverallChatsDetails {
	date: string
	rating: DatumRating
}

export interface DatumRating {
	rating1: number
	rating2: number
}

export interface Summary {
	rating: SummaryRating
}

export interface SummaryRating {
	totalChats: number
	totalAtendidos: number
	totalNoAtendidos: number
}

export interface Params extends DatesParams, LocationsParams {
	splits?: number[]
}

export type OverallChatsParams = {
	idOrg: number
	params: Params
}

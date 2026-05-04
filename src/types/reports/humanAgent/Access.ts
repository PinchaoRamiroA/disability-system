import { DatesParams } from '@/types/Filter/FilterParams'

export interface AccessGetParams {
	start: string
	end: string
	idVa: number
	id?: string
	idType?: string
	since?: number
	until?: number
	channels?: number[]
	idRegionals?: number[]
	idDepartments?: number[]
	idCities?: number[]
	page: number
	perPage: number
}

export interface AccessCSVParams extends DatesParams {
	channels?: number[]
	idOrg: number
	idVa: number
	id?: string
	idType?: string
	idRegionals?: number[]
	idDepartments?: number[]
	idCities?: number[]
	since?: number
	until?: number
}

export interface AccessLogs {
	currentPage: number
	currentResults: number
	entriesConsumers: EntriesConsumer[]
	totalPages: number
	totalResult: number
}

export interface EntriesConsumer {
	countEntries: number
	endCustCity: string
	endCustDepartment: string
	endCustIdNumber: string
	endCustIdType: string
	endCustMail: string
	endCustPhone: string
	endCustRegional: string
}

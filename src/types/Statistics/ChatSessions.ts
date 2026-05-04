import { FilterParams, LocationsParams } from '../Filter/FilterParams'

export interface ChatSessions {
	data: Datum[]
	summary: Summary[]
}

export interface Datum {
	date: string
	detail: Summary[]
}

export interface Summary {
	count: number
	idChannel: number
}

export interface ConversacionesCanalPayload
	extends FilterParams,
		LocationsParams {}

export interface ConversacionesCanalParams {
	idOrg: number
	payload: ConversacionesCanalPayload
}

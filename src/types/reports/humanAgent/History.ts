import { DatesParams, LocationsParams } from '@/types/Filter/FilterParams'

export interface History {
	currentPage: number
	currentResults: number
	interactions: InteractionBase[]
	totalPages: number
	totalResult: number
}

export interface AttentionInteractionsList {
	currentPage: number
	currentResults: number
	interactions: AttentionInteractions[]
	totalPages: number
	totalResult: number
}

export interface InteractionBase {
	channelId: number
	id: number
	idConversation: number
	intent: string
	interactionTime: number
	requestData: string
	responseAnswer: string
}

export interface AttentionInteractions {
	agentName: string
	channel: string
	city: string
	department: string
	endCustIdNumber: string
	endCustIdType: string
	endCustMail: string
	endCustName: string
	endCustPhone: string
	event: string
	idConversation: number
	interactionTime: string
	regional: string
	splitOrigin: string
	intent?: string
}

export interface HistoryGetParams extends DatesParams, LocationsParams {
	idVa: number
	page?: number
	id?: string
	idType?: string
	idConv?: number[]
	channels?: number[]
	intents?: number[]
}

export interface MaxEntriesParams extends DatesParams {
	idVa: number
	idRegionals?: number[]
	idDepartments?: number[]
	idCities?: number[]
	channels?: number[]
	id?: string
	idType?: string
}

export interface AgentGetChatsParams extends DatesParams, LocationsParams {
	agents?: number[]
	splits?: number[]
	events?: number[]
	page?: number
	channels?: number[]
	attended: boolean
}

export interface InteractionHistory {
	channelId: number
	cityName: string
	departmentName: string
	id: number
	idConversation: number
	idRating: number
	intent: string
	interactionTime: number
	regionalName: string
	requestData: string
	responseAnswer: string
}

export interface HistoryReferenceFileParams
	extends LocationsParams,
		DatesParams {
	idVa: number
	idOrg: number
	id?: string
	idType?: string
	idConv?: number[]
	channels?: number[]
	intents?: number[]
	csvReport: boolean
}

export interface ChatsAttentionCSVParams extends DatesParams, LocationsParams {
	agents?: number[]
	splits?: number[]
	events?: number[]
	channels?: number[]
	csvReport: boolean
}

export interface HistoryUserData {
	conversationId: string
	cityName: string
	departmentName: string
	endCustIdNumber: string
	endCustIdType: string
	endCustMail: string
	endCustPhone: string
}

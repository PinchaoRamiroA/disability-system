import { DatesParams, FilterParams } from './Filter/FilterParams'
import { ReducerType } from './Reducer'

export type IndicatorId =
	| 'TMO'
	| 'TMAsignacion'
	| 'TMAtencionAV'
	| 'TMAtencionAH'
	| 'FCR'
	| 'AttendedChats'
	| 'NotAttendedChats'
	| 'NivelRespuestaBOT'
	| 'NivelAbandono'

export type ExpIndicatorId = 'NS' | 'RU' | 'NPS'

export type AttentionIndicator = {
	id: IndicatorId
	value: number | string
}

export type ExperienceIndicator = {
	id: ExpIndicatorId
	value: number | string
}

export type IndiAttentionTypes = {
	resource: ReducerType<AttentionIndicator>[]
}

export type IndiExperienceTypes = {
	resource: ReducerType<ExperienceIndicator>[]
}

export type IndicatorObject = {
	id: IndicatorId
	title: string
	description?: string
	tooltip?: string
}

export interface ExpIndicatorObject {
	id: ExpIndicatorId
	title: string
	description: string
	tooltip?: string
}

export interface TMOFilters {
	idOrg: number
	payload: FilterParams & {
		channels?: number[]
		splits?: number[]
	}
}

// Indicadores atención - Chats atendidos y atendidos
interface TempAttentionFilters extends DatesParams {
	splits?: number[]
	channels?: number[]
}

export interface AttentionFilters {
	idOrg: number
	payload: TempAttentionFilters
}

export interface DatesAndIdVaParams {
	idOrg: number
	payload: DatesParams & { idVa: number }
}

export interface DatesChannelsAndVA {
	idOrg: number
	payload: DatesParams & { idVa: number; channels?: number[] }
}

export type ExperienceFilters = DatesAndIdVaParams

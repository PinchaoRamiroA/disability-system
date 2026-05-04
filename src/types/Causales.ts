import { LogSocketFromCausals } from './HumanAgent/WebChat'
import { OrgAndIdva } from './OrgAndIdva'

export interface Causal {
	[key: string]: string | number | boolean
	id: number
	idCausal: number
	nombre: string
	descripcion: string
	fechaCreacion: string
	fechaActualizacion: string
	activo: boolean
	logic_delete: number
}

export interface GetCausalesActivas {
	payload: OrgAndIdva
	callback: () => void
}

export interface SaveCausalesNegocio {
	body: SaveCausalesNegocioBody
	callback: () => void
	logErrorPayload: LogSocketFromCausals
}

export interface SaveCausalesNegocioBody {
	idConversacion: number
	listIdCausales: IdCausales[]
}

export interface SaveCausalFin {
	idConversacion: number
	idCausalFinalizacion: number
	logErrorPayload: LogSocketFromCausals
}

export type IdCausales = {
	idCausal: number
}

export interface CreateCausalBody {
	nombre: string
	descripcion: string
}

export interface UpdateCausalBody {
	activo: boolean
	idCausal: number
	nombre: string
	descripcion: string
}

export interface DeleteCausalNegocioBody {
	codigoCausal: number
}

export interface DeleteCausalFinBody {
	codigoCausalFinalizacion: number
}

export interface CausalesStatsParams {
	idOrg: number
	payload: {
		start: string
		end: string
		channels?: number[]
		splits?: number[]
		categories?: number[]
	}
}

// Data del reporte de causales
export interface ReporteCausalesDataRaw {
	currentPage: number
	currentResults: number
	humanAgentTyping: HumanAgentTypingRaw[]
	totalPages: number
	totalResult: number
}

export interface HumanAgentTypingCommon {
	dateConection: string
	endCausal: string
	endCustIdNumber: string
	endCustIdType: string
	idConv: number
	transferToAgentCausal: string
}

export interface HumanAgentTypingRaw extends HumanAgentTypingCommon {
	businessCausal: string[]
	split: string[]
	humanAgent: string[]
}

export interface HumanAgentTyping extends HumanAgentTypingCommon {
	split: string[]
	humanAgent: string[]
	businessCausal: string
	conversationURL: string
}

export interface ReporteCausalesData {
	currentPage: number
	currentResults: number
	humanAgentTyping: HumanAgentTyping[]
	totalPages: number
	totalResult: number
}

export interface HumanAgentTypingSubtable {
	[key: string]: string | number
	id: number | string
	humanAgent: string
	split: string
	dateConection: string
	// causales?: string
}

export interface HumanAgentTypingFormatted extends HumanAgentTypingCommon {
	id: number
	split: string
	humanAgent: string
	businessCausal: string
	conversationURL: string
	subtable: HumanAgentTypingSubtable[]
}

export interface ReporteCausalesData {
	currentPage: number
	currentResults: number
	humanAgentTyping: HumanAgentTyping[]
	totalPages: number
	totalResult: number
}

export interface ReporteCausalesDataRaw {
	currentPage: number
	currentResults: number
	humanAgentTyping: HumanAgentTypingRaw[]
	totalPages: number
	totalResult: number
}

// Reporte de causales
interface ReporteCausalesParamsPayload {
	agents?: number[]
	start: string
	end: string
	channels?: number[]
	splits?: number[]
	businessCausal?: number[]
	endCausal?: number[]
	transferToAgentCausal?: number[]
}
export interface ReporteCausalesParams {
	idOrg: number
	payload: ReporteCausalesParamsPayload & {
		page: number
		perPage: number
	}
}

export interface CSVReporteCausalesParams extends ReporteCausalesParamsPayload {
	idOrg: number
}

export type TipoCausal = 'negocio' | 'finalizacion' | 'paso-automatico'

export interface EstadisticaCausales {
	Causales: {
		[key: string]: number
	}
	Total: number
}

/**
 * Causales seleccionadas por el AH para una conversación
 */
export interface CausalConversacion {
	conversationId: number
	business: Causal[]
	ending: Causal | null
	splitId?: number
	transfer?: boolean
}

/**
 * Paso automático
 */
export interface CausalPasoAutomatico {
	idCause: number
	nombre: string
}

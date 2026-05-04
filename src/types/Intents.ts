/**
 * Intenciones en general
 */
export interface Intents {
	count: number
	detail?: IntentsDetail[]
}

export interface IntentsDetail {
	detail: Detail[]
	intent: string
}

export interface Detail {
	count: number
	idChannel: number
}

/**
 * Filtro de intenciones
 */
export type IntentsQuantities = {
	id: number
	name: string
	quantity: number
	label?: string
}

/**
 * API
 */
export type IntentsAPIParams = {
	channels?: number[]
	start?: string
	end?: string
	idRegionals?: number[]
	id?: string
	idType?: string
	idVa?: number
}

export type IntentsSliceParams = {
	idOrg: number
	filters: IntentsAPIParams
}

/**
 * Gráfica de intenciones
 */
export type IntentsChart = Parent

export interface Parent {
	name: string
	color?: string
	children?: Child[]
}

export interface Child {
	name: string
	color?: string
	value?: number
	children?: Child[]
}

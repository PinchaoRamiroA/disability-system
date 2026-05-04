export type Filter = {
	//1filtro compañías
	idOrg?: number
	//2Filtro fechas
	start?: string
	end?: string
	//3filtro canales
	channels?: number[]
	//4filtro locaciones
	regionals?: number[]
	departments?: number[]
	cities?: number[]
	//5filtro entradas
	since?: number
	until?: number
	//6filtro document & documentType
	id?: string
	idType?: string
	//7filtro resolución,
	resolution?: ResolutionValue[]
	//8filtro asesor virtual
	idVa?: number
	//9filtro intenciones
	intents?: number[]
	//10filtro asesores humanos
	agents?: number[]
	//11filtro atención
	attention?: AttentionValue
	//12filtro eventos fin de conversación
	events?: number[]
	//13filtro splits
	splits?: number[]
	singleSplit?: number
	// 14 filtro tipos de notificación
	notifChannels?: number[]
	// Id conversación
	idConv?: number
	idsConv?: number[]
	// estatus de integración
	integrationStatus?: boolean
	integrationService?: string
	causalesNegocio?: number[]
	causalesFin?: number[]
	causalesPasoAutomatico?: number[]
}

export type ResolutionValue = 'automated' | 'escalated'

export type Resolution = {
	value: ResolutionValue
	checked: boolean
}

export type AttentionValue = 'attended' | 'notAttended'
export type Attention = {
	value: AttentionValue
	checked: boolean
	label: 'Chats atendidos' | 'Chats no atendidos'
}

export type ApplyFilters = {
	agents?: boolean
	dates?: boolean
	channels?: boolean
	idConv?: boolean
	idsConv?: boolean
	integrationStatus?: boolean
	integrationService?: boolean
	resolution?: boolean
	attention?: boolean
	user?: boolean
	entries?: boolean
	range?: boolean
	locations?: boolean
	regionals?: boolean
	locationsCities?: boolean
	intents?: boolean
	companies?: boolean
	virtualAgent?: boolean
	splits?: boolean
	singleSplit?: boolean
	events?: boolean
	notificationChannels?: boolean
	causalesNegocio?: boolean
	causalesFin?: boolean
	causalesPasoAutomatico?: boolean
}

export type FilterName =
	| 'agents'
	| 'dates'
	| 'channels'
	| 'idConv'
	| 'idsConv'
	| 'integrationStatus'
	| 'integrationService'
	| 'resolution'
	| 'attention'
	| 'user'
	| 'entries'
	| 'range'
	| 'locations'
	| 'regionals'
	| 'locationsCities'
	| 'intents'
	| 'companies'
	| 'virtualAgent'
	| 'splits'
	| 'singleSplit'
	| 'events'
	| 'notificationChannels'
	| 'causalesNegocio'
	| 'causalesFin'
	| 'causalesPasoAutomatico'

export interface FilterClicked {
	clicked?: boolean
}

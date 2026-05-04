export interface Integrations {
	currentPage: number
	currentResults: number
	integrationsResult: IntegrationsResult[]
	totalPages: number
	totalResult: number
	totalSuccess: number
	totalFailed: number
}

export interface IntegrationsResult {
	serviceName: string
	endCustIdNumber: string
	endCustIdType: string
	endPoint: string
	channel: string
	idConv: string
	idInteraction: string
	request: string
	response: string
	success: boolean
	time: string
	conversationURL?: string
}

export interface IntegrationsParams {
	idOrg: number
	payload: {
		end: string
		idVa: number
		start: string
		channels?: number[]
		id?: string
		idConv?: number
		idType?: string
		page?: number
		perPage?: number
		integrationState?: boolean
		serviceName?: string
	}
}

export type Company = {
	idOrg: number
	name: string
	schemaName: string
	isActive?: boolean
	organizationType?: number
}

export type NormalizedCompany = {
	id: number | string
	idOrg: number
	name: string
	schemaName: string
	label?: string
	isActive?: boolean
	loginAttemptsAllowed?: number
	organizationType?: number
}

export type CompanyHeaders =
	| 'idOrg'
	| 'name'
	| 'schemaName'
	| 'isActive'
	| 'organizationType'

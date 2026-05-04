export interface GetExpiracionSesionParams {
	idOrg: number
	idVa: number
}

export type AcronimoExpiracionSesion = 'TICA' | 'TICC'

export interface ExpiracionSesion {
	acronym: AcronimoExpiracionSesion
	description: string
	clientMessage: string
	closingTime: number
	idSessionExpirationType: number
	idVa: number
}

export interface PostExpiracionSesionParams {
	idOrg: number
	payload: {
		idSessionExpirationType: number
		clientMessage?: string
		closingTime?: number
	}
}

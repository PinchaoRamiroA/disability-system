import { Status } from './status'

export type Auth = {
	user: User
	authenticated?: boolean
	status?: Status
	authType?: AuthType
}

export type ChangePassFlag = {
	changePassword: boolean
}

export type ChangePassValue = {
	changePassword: 'idle' | 'true' | 'false'
}

export type LDAPLogin = boolean

export type StatusAdviser = 'Activo' | 'Inactivo' | 'Pausa'

export type User = {
	company: number
	email: string
	exp: number
	nameCompany?: string
	role: number
	schema?: string
	sub?: string
	statusAdviser?: StatusAdviser
}

export type Credentials = {
	email: string
	password: string
	userAgentData: string
	ip: string
}

export interface AuthParams {
	credentials: Credentials
	setUserLocked: (value: boolean) => void
}

export type LDAPCredentials = {
	code: string
	state: string
	session_state: string
}

export type Token = {
	token: string
	refreshToken?: string
}

export type AuthType = 'username/passowrd' | 'ldap'

export type IdOrgParam = {
	idOrg: number | undefined
}

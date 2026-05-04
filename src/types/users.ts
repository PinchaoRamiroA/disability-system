export type User = {
	email: string
	role: number
	fullName: string
	idUser: number
	company: number
	companyName: string
	isActive: boolean
	isLocked: boolean
	userName: string
	validCreate: boolean
	dateCreate: string
	modifiedBy: string
	dateUpdate?: string
}

export type NormalizedUser = {
	id: number | string
	email: string
	role: number
	roleLabel: string
	password?: string
	fullName: string
	company: number
	companyName: string
	idUser: number
	dateCreate: string
	dateUpdate?: string
	modifiedBy: string
	isActive?: boolean
	isLocked?: boolean
	userName?: string
	validCreate?: boolean
}

export type ToggleActiveParams = {
	idUser: number
	isActive?: boolean
	isLocked?: boolean
}

export type UserFilters = {
	companies?: number[]
	roles?: number[]
}

export type RoleObject = {
	label: RoleLabel
	role: Role
}

export type ParametroBloqueo = {
	organization: number
	loginAttempts: number
}

export type UpdateParametroBloqueo = {
	organization: number
	loginAttemptsAllowed: number
}

export type ParametroCaducidad = {
	organization: number
	passwordExpiration: number
}

export type UpdateParametroCaducidad = {
	organization: number
	passwordExpirationDays: number
}

export type RoleLabel =
	| 'Superadministrador'
	| 'Supervisualizador'
	| 'Administrador de entidad'
	| 'Visualizador de entidad'
	| 'Asesor humano'
	| 'Supervisor de asesor humano'

export type Role = 1 | 2 | 3 | 4 | 5 | 6

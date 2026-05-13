import {
	AuthUser,
	LoginRequest,
	LoginData,
	TokenPayload,
} from './api'

export type Auth = {
	id?: number
	email: string
	nombre: string
	role: string
	numero_celular?: string
	direccion?: string
	numero_documento?: string
	estado?: boolean
}

export type ChangePassFlag = {
	changePassword: boolean
}

export type ChangePassValue = {
	changePassword: 'idle' | 'true' | 'false'
}

export type User = {
	email: string
	nombre: string
	role: string
}

export type Credentials = LoginRequest

export type LDAPCredentials = {
	code: string
	state: string
	session_state: string
}

export type Token = TokenPayload
export type LoginToken = LoginData

export type AuthType = 'username/password' | 'ldap'

export const normalizeAuthUser = (user: Auth | AuthUser): Auth => {
	if ('correo' in user) {
		return {
			id: user.id,
			email: user.correo,
			nombre: user.nombre,
			role: user.rol.nombre,
			numero_celular: user.numero_celular,
			direccion: user.direccion,
			numero_documento: user.numero_documento,
			estado: user.estado,
		}
	}

	return user
}

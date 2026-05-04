import { StatusAdviser, Token, User } from '@/types/auth'
import jwt_decode from 'jwt-decode'
import {
	ACCESS_TOKEN_NAME,
	AGENT_STATUS,
	LAST_LOGIN_TIME_NAME,
	REFRESH_TOKEN_NAME,
	TIMEOUT_CLOSE_SESSION,
} from '@/utils/constants/userSession'
import { AgentStatus } from '@/types/HumanAgent/WebChat'

export const saveAuthToken = (data: Token): void => {
	localStorage.setItem(ACCESS_TOKEN_NAME, data.token)
	localStorage.setItem(REFRESH_TOKEN_NAME, data.refreshToken ?? '')
	localStorage.setItem(
		LAST_LOGIN_TIME_NAME,
		String(new Date(Date.now()).getTime())
	)
}

// Guardar estado del asesor humano en localStorage
export const saveAgentStatus = (
	statusAdviser: StatusAdviser | undefined
): void => {
	let status: AgentStatus
	if (statusAdviser === 'Activo') {
		status = 'CONECTADO'
	} else if (statusAdviser === 'Pausa') {
		status = 'PAUSA'
	} else {
		status = 'DESCONECTADO'
	}
	localStorage.setItem(AGENT_STATUS, status)
}

export const getAuthToken = () => {
	const now = new Date(Date.now()).getTime()
	const timeSinceLastLogin =
		now - Number(localStorage.getItem(LAST_LOGIN_TIME_NAME))
	if (timeSinceLastLogin < TIMEOUT_CLOSE_SESSION) {
		return localStorage.getItem(ACCESS_TOKEN_NAME)
	}
}

export const parseAuthToken = (data: Token): User => {
	const decoded_token: User = jwt_decode(data.token)
	return decoded_token
}

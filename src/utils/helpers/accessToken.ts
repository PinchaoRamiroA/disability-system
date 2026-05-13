import { Token } from '@/types/auth'

const ACCESS_TOKEN_NAME = 'access_token'
const REFRESH_TOKEN_NAME = 'refresh_token'

export const saveAuthToken = (data: Token): void => {
	localStorage.setItem(ACCESS_TOKEN_NAME, data.access_token)
	localStorage.setItem(REFRESH_TOKEN_NAME, data.refresh_token || '')
}

export const getAuthToken = (): string | null => {
	return localStorage.getItem(ACCESS_TOKEN_NAME)
}

export const getRefreshToken = (): string | null => {
	return localStorage.getItem(REFRESH_TOKEN_NAME)
}

export const clearAuthToken = (): void => {
	localStorage.removeItem(ACCESS_TOKEN_NAME)
	localStorage.removeItem(REFRESH_TOKEN_NAME)
}

export const parseAuthToken = (_data: Token): { email: string; role: string } => {
	return {
		email: '',
		role: 'admin',
	}
}
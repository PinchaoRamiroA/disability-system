import {
	orchestratorClient,
	orchestratorClientRefresh,
	orchestratorWithAuthClient,
} from '@/services/api/utilities/instances'
import {
	ChangePassFlag,
	Credentials,
} from '@/types/auth'
import { LoginResponse, RefreshTokenResponse } from '@/types/api'
import { getRefreshToken } from '@/utils/helpers/accessToken'

export async function login(credentials: Credentials) {
	const response = await orchestratorClient.post<LoginResponse>(
		'/auth/login',
		credentials
	)
	return response.data.data
}

export async function refreshToken() {
	const response = await orchestratorClientRefresh.post<RefreshTokenResponse>(
		'/auth/refresh',
		{ refresh_token: getRefreshToken() || '' }
	)

	return response.data.data
}

export async function checkChangePasswordAPI() {
	const response = await orchestratorWithAuthClient.get<ChangePassFlag>(
		'/api/auth/changePasswordByExpiration '
	)
	return response.data
}

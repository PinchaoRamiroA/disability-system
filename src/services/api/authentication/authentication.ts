import {
	orchestratorClient,
	orchestratorClientRefresh,
	orchestratorWithAuthClient,
} from '@/services/api/utilities/instances'
import {
	ChangePassFlag,
	Credentials,
	LDAPCredentials,
	Token,
} from '@/types/auth'

export async function login(credentials: Credentials) {
	const response = await orchestratorClient.post<Token>(
		'/api/auth',
		credentials
	)
	return response.data
}

export async function loginLDAP(credentials: LDAPCredentials) {
	const response = await orchestratorClient.post<Token>(
		'/api/auth/auth_ldap',
		credentials
	)
	return response.data
}

export async function refreshToken() {
	const response = await orchestratorClientRefresh.post<Token>(
		'api/auth/refreshSesion'
	)

	return response.data
}

export async function checkChangePasswordAPI() {
	const response = await orchestratorWithAuthClient.get<ChangePassFlag>(
		'/api/auth/changePasswordByExpiration '
	)
	return response.data
}

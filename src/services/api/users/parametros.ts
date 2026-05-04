import {
	ParametroBloqueo,
	ParametroCaducidad,
	UpdateParametroBloqueo,
	UpdateParametroCaducidad,
} from '@/types/users'
import { orchestratorWithAuthClient } from '../utilities/instances'

export const getParametrosBloqueoAPI = async () => {
	const response = await orchestratorWithAuthClient.get<ParametroBloqueo[]>(
		'/api/loginAttempsAllowed'
	)
	return response.data
}

export const updateParametrosBloqueoAPI = async (
	params: UpdateParametroBloqueo
) => {
	const { loginAttemptsAllowed, organization } = params
	const response = await orchestratorWithAuthClient.post<ParametroBloqueo[]>(
		`/api/loginAttempsAllowed/byOrganization/${organization}`,
		{ loginAttemptsAllowed }
	)
	return response.data
}

export const getParametrosCaducidadAPI = async () => {
	const response = await orchestratorWithAuthClient.get<ParametroCaducidad[]>(
		'/api/passwordExpirationDays'
	)
	return response.data
}

export const updateParametrosCaducidadAPI = async (
	params: UpdateParametroCaducidad
) => {
	const { organization, passwordExpirationDays } = params
	const response = await orchestratorWithAuthClient.post<
		ParametroCaducidad[]
	>(`/api/passwordExpirationDays/byOrganization/${organization}`, {
		passwordExpirationDays,
	})
	return response.data
}

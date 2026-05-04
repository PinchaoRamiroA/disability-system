import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	ExpiracionSesion,
	GetExpiracionSesionParams,
	PostExpiracionSesionParams,
} from '@/types/Settings/asistente-virtual/Expiracion'

// Obtener mensajes de expiración de sesión
export const getExpiracionSesionData = async ({
	idOrg,
	idVa,
}: GetExpiracionSesionParams) => {
	const response = await orchestratorWithAuthClient.get<ExpiracionSesion[]>(
		`/api/organization/${idOrg}/sessionExpiration/getSessionExpirationType?idVa=${idVa}`
	)
	return response.data
}

// Actualizar mensaje y/o tiempo de expiración de sesión
export async function updateExpiracionSesion(
	params: PostExpiracionSesionParams
) {
	const response = await orchestratorWithAuthClient.post<ExpiracionSesion>(
		`/api/organization/${params.idOrg}/sessionExpiration/updateSessionExpirationType`,
		params.payload
	)

	return response.data
}

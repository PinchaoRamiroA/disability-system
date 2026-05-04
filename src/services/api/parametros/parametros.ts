import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import { ParametrosGenerales } from '@/types/Settings/General/Parametros'

// Obtener parámetros
export const getParametros = async () => {
	const response = await humanlAgentWithAuthClient.get<ParametrosGenerales>(
		'/api/obtenerParametros'
	)

	return response.data
}

// Actualizar parámetros
export async function updateParametros(params: ParametrosGenerales) {
	const response = await humanlAgentWithAuthClient.post<ParametrosGenerales>(
		'/api/actualizarParametros',
		params
	)

	return response.data
}

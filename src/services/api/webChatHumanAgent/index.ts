import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import { LogSocket } from '@/types/HumanAgent/WebChat'
import { Splits } from '@/types/Splits'

export const getAvailableTransferSplitsAPI = async () => {
	const response = await humanlAgentWithAuthClient.get<Splits[]>(
		'/api/obtenerSplitsDisponiblesTraslado'
	)

	return response.data
}

export const saveLogAPI = async (params: LogSocket) => {
	const response = await humanlAgentWithAuthClient.post<Splits[]>(
		`/api/LogErrorSocket/${params.idOrg}`,
		params.payload
	)

	return response.data
}

import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import { EstadoChats } from '@/types/Statistics/HumanAgent/EstadoChats'
import { IdOrgParam } from '@/types/auth'
import { idOrgQueryParam } from '@/utils/helpers/idOrgQueryParam'

export async function getChatsEnCola({ idOrg }: IdOrgParam) {
	const queryParam = idOrgQueryParam(idOrg)
	const response = await humanlAgentWithAuthClient.get<EstadoChats[]>(
		`/api/obtenerChatsEnCola${queryParam}`
	)
	return response.data
}

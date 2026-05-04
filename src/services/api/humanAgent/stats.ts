import {
	humanlAgentWithAuthClient,
	orchestratorWithAuthClient,
} from '@/services/api/utilities/instances'
import {
	EscalatedChatsFilters,
	EscalatedChats,
	AvgTimeFilters,
	AvgTime,
	AgentsChats,
	AgentsChatsFilters,
} from '@/types/HumanAgent'
import { OverallChats, OverallChatsParams } from '@/types/HumanAgent/Chats'
import { EstadoActual } from '@/types/HumanAgent/EstadoAsesores'
import { IdOrgParam } from '@/types/auth'
import { idOrgQueryParam } from '@/utils/helpers/idOrgQueryParam'

// Estadísticas - Asesor humano - Chats
export async function getChats(args: OverallChatsParams) {
	const { idOrg, params } = args

	const response = await orchestratorWithAuthClient.get<OverallChats>(
		`/api/statistics/lines/chats/attended/${idOrg}`,
		{ params }
	)

	return response.data
}

export async function getEscalatedChats(
	idOrg: number,
	filters: EscalatedChatsFilters
) {
	const response = await orchestratorWithAuthClient.get<EscalatedChats>(
		`/api/statistics/bars/totalchats/scaled/${idOrg}`,
		{ params: filters }
	)

	return response.data
}

export async function getAvgTime(idOrg: number, filters: AvgTimeFilters) {
	const response = await orchestratorWithAuthClient.get<AvgTime>(
		`/api/statistics/bars/average/time/agents/${idOrg}`,
		{ params: filters }
	)

	return response.data
}

// Estadísticas - Asesor humano - Chats por asesor
export async function getAgentsChats(
	idOrg: number,
	filters: AgentsChatsFilters
) {
	const response = await orchestratorWithAuthClient.get<AgentsChats>(
		`/api/statistics/bars/totalchats/agents/${idOrg}`,
		{ params: filters }
	)

	return response.data
}

// Estado asesores - Actual
export async function getEstadoActual({ idOrg }: IdOrgParam) {
	const queryParams = idOrgQueryParam(idOrg)
	const response = await humanlAgentWithAuthClient.get<EstadoActual[]>(
		`/api/obtenerEstadoConexionAsesores${queryParams}`
	)

	return response.data
}

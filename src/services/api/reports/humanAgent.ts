import {
	orchestratorWithAuthClient,
	humanlAgentWithAuthClient,
} from '@/services/api/utilities/instances'
import {
	EstadoHistorico,
	EstadoHistoricoParams,
} from '@/types/HumanAgent/EstadoAsesores'
import {
	AccessCSVParams,
	AccessGetParams,
	AccessLogs,
} from '@/types/reports/humanAgent/Access'
import {
	InteractionHistory,
	History,
	HistoryGetParams,
	HistoryReferenceFileParams,
	AgentGetChatsParams,
	AttentionInteractionsList,
	ChatsAttentionCSVParams,
	MaxEntriesParams,
} from '@/types/reports/humanAgent/History'

export async function getAccessLog(idOrg: number, params: AccessGetParams) {
	const response = await orchestratorWithAuthClient.get<AccessLogs>(
		`/api/statistics/organization/${idOrg}/entries_clients/consumerClients`,
		{ params }
	)

	return response.data
}

export async function getHistory(idOrg: number, params: HistoryGetParams) {
	const response = await orchestratorWithAuthClient.get<History>(
		`/api/statistics/organization/${idOrg}/interactions/intentsUnificado/`,
		{ params }
	)

	return response.data
}

export async function getMaxEntries(idOrg: number, params: MaxEntriesParams) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${idOrg}/entries_clients/maxCountEntries`,
		{ params }
	)

	return response.data
}

export async function getAgentChats(
	idOrg: number,
	params: AgentGetChatsParams
) {
	const response =
		await orchestratorWithAuthClient.get<AttentionInteractionsList>(
			`/api/statistics/organization/${idOrg}/interactions/agent/interactions/chats`,
			{ params }
		)

	return response.data
}

export async function getInteractionHistory(
	idOrg: number,
	conversationId: number
) {
	const response = await orchestratorWithAuthClient.get<InteractionHistory[]>(
		`/api/statistics/organization/${idOrg}/interactions/conversation/${conversationId}`
	)

	return response.data
}

// Servicio de descarga de historial (retorna referencia)
export async function getHistoryReferenceFile(
	params: HistoryReferenceFileParams
) {
	const response = await orchestratorWithAuthClient.get<string>(
		'/api/reports/conversations',
		{ params }
	)

	return response.data
}

// Obtener CSV descargable de chats no atendidos
export async function getNotAttendedCsvFile(
	idOrg: number,
	params: ChatsAttentionCSVParams
) {
	const response = await orchestratorWithAuthClient.get<string>(
		`api/statistics/organization/${idOrg}/interactions/agent/interactions/notAttended`,
		{ params }
	)

	return response.data
}

// Obtener CSV descargable de accesos
export async function getAccessCsvFile(params: AccessCSVParams) {
	const response = await orchestratorWithAuthClient.get<string>(
		'api/reports/consumerClients',
		{ params }
	)

	return response.data
}

// Estado asesores - Histórico
export async function getEstadoHistorico(params: EstadoHistoricoParams) {
	const response = await humanlAgentWithAuthClient.get<EstadoHistorico>(
		'api/obtenerHistoricoConexionAsesores',
		{ params }
	)

	return response.data
}

// Estado asesores - Histórico - Descargar
export async function getDescargaHistorico(params: EstadoHistoricoParams) {
	const response = await humanlAgentWithAuthClient.get<string>(
		'api/descargarHistoricoConexionAsesores',
		{ params }
	)

	return response.data
}

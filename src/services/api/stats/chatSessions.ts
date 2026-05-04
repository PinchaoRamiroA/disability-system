import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	ChatSessions,
	ConversacionesCanalParams,
} from '@/types/Statistics/ChatSessions'

export async function getChatSessionsConversations(
	filters: ConversacionesCanalParams
) {
	const response = await orchestratorWithAuthClient.get<ChatSessions>(
		`/api/statistics/lines/conversations/organization/${filters.idOrg}`,
		{ params: filters.payload }
	)

	return response.data
}

export async function getChatSessionsInteractions(
	filters: ConversacionesCanalParams
) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/total`,
		{ params: filters.payload }
	)

	return response.data
}

// Tiempo promedio
export async function getInteractionsAVG(filters: ConversacionesCanalParams) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/AverageInteraction`,
		{ params: filters.payload }
	)

	return response.data
}

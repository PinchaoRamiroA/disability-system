import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	Integrations,
	IntegrationsParams,
} from '@/types/Statistics/VirtualAgent/Integrations'
import { VirtualAgent } from '@/types/VirtualAgent'

export async function getIds(idOrg: number) {
	const response = await orchestratorWithAuthClient.get<VirtualAgent[]>(
		`/api/organization/${idOrg}/virtualAgents`
	)

	return response.data
}

// Integraciones
export async function getIntegrations(params: IntegrationsParams) {
	const { idOrg, payload } = params

	const response = await orchestratorWithAuthClient.get<Integrations>(
		`/api/statistics/organization/${idOrg}/integrations/consumerIntegrations`,
		{ params: payload }
	)

	return response.data
}

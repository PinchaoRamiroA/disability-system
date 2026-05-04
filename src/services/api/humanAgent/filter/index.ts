import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { IdOrgParam } from '@/types/auth'
import { Agents } from '@/types/HumanAgent/Agents'

export async function getAgents(params: IdOrgParam) {
	const response = await orchestratorWithAuthClient.get<Agents[]>(
		'/api/users/agents',
		{
			params,
		}
	)

	return response.data
}

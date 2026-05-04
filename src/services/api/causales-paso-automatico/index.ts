import {
	humanlAgentWithAuthClient,
	orchestratorWithAuthClient,
} from '@/services/api/utilities/instances'
import { IdOrgParam } from '@/types/auth'
import {
	EstadisticaCausales,
	CausalesStatsParams,
	CausalPasoAutomatico,
} from '@/types/Causales'

// Obtener causales de negocio
export const causalesPasoAutomatico = async (params: IdOrgParam) => {
	const response = await humanlAgentWithAuthClient.get<
		CausalPasoAutomatico[]
	>('/api/CauseStepAgentHuman/getAutomaticTransferToAgent', { params })

	return response.data
}

/**
 * Estadísticas
 */
// Obtener data para mostrar estadística de causales de paso automático
export async function estadisticaPasoAutomatico(params: CausalesStatsParams) {
	const response = await orchestratorWithAuthClient.get<EstadisticaCausales>(
		`/api/statistics/organization/${params.idOrg}/attention/agent/automaticTransferToAgent`,
		{ params: params.payload }
	)

	return response.data
}

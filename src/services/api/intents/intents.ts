import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { Intents, IntentsAPIParams, IntentsQuantities } from '@/types/Intents'

export async function getIntents(idOrg: number, filters: IntentsAPIParams) {
	const response = await orchestratorWithAuthClient.get<Intents>(
		`/api/statistics/bars/intentions/organization/${idOrg}`,
		{ params: filters }
	)

	return response.data
}

export async function getIntentsQuantities(
	idOrg: number,
	filters: IntentsAPIParams
) {
	const response = await orchestratorWithAuthClient.get<IntentsQuantities[]>(
		`/api/statistics/organization/${idOrg}/intents/quantity`,
		{ params: filters }
	)

	return response.data
}

/**
 * Filtro de intenciones para el reporte de trazabilidad
 * @param idOrg Organización
 * @param params Filtros
 * @returns IntentsQuantities[]
 */
export async function getTraceabilityIntents(
	idOrg: number,
	params: IntentsAPIParams
) {
	delete params.channels
	const response = await orchestratorWithAuthClient.get<IntentsQuantities[]>(
		`api/statistics/organization/${idOrg}/intents/quantityEntriesConsumesClients`,
		{ params }
	)

	return response.data
}

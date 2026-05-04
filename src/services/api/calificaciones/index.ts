import {
	IntentsTimeRating,
	RatingsParams,
	TopRating,
} from '@/types/Statistics/VirtualAgent/Calificaciones'
import { orchestratorWithAuthClient } from '../utilities/instances'

// Calificaciones de intenciones
export async function getRatings(params: RatingsParams) {
	const response = await orchestratorWithAuthClient.get<TopRating>(
		`/api/statistics/bars/intentions/ratings/organization/${params.idOrg}`,
		{ params: params.payload }
	)

	return response.data
}

// Intenciones calificadas en el tiempo
export async function getIntentsTimeRating(params: RatingsParams) {
	const response = await orchestratorWithAuthClient.get<IntentsTimeRating[]>(
		`/api/statistics/lines/calificaciones/organization/${params.idOrg}`,
		{
			params: params.payload,
		}
	)

	return response.data
}

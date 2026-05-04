import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { OrgAndIdva } from '@/types/OrgAndIdva'
import {
	ConfigFeature,
	ConfigFeatureUpdate,
} from '@/types/Settings/personalizacion/funcionalidades'

// Obtiene la configuración de funcionalidades activas
export const getFeaturesConfig = async ({ idOrg, idVa }: OrgAndIdva) => {
	const response = await orchestratorWithAuthClient.get<ConfigFeature[]>(
		`/api/${idOrg}/features/${idVa}/getFeatures`
	)
	return response.data
}

// Actualiza el estado 'activo' de una funcionalidad
export async function updateFeatureConfig({
	idOrg,
	idVa,
	payload,
}: ConfigFeatureUpdate) {
	const response = await orchestratorWithAuthClient.put<ConfigFeature>(
		`/api/${idOrg}/features/${idVa}/updateFeatureStatus`,
		payload
	)

	return response.data
}

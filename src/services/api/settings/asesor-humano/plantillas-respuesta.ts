import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	DeletePlantillaRespuesta,
	PlantillaRespuesta,
	PlantillasRespuestaResponse,
	UpsertPlantillaRespuesta,
} from '@/types/Settings/asesor-humano/plantillas-respuesta'

// Obtener plantillas de respuesta
export const getPlantillasRespuestaApi = async (idOrg: number) => {
	const response =
		await orchestratorWithAuthClient.get<PlantillasRespuestaResponse>(
			`/api/templates/organization/${idOrg}/getAllTemplatesAvailable`
		)
	return response.data
}

// Actualizar plantilla de respuesta
export async function upsertPlantillaRespuestaApi(
	params: UpsertPlantillaRespuesta
) {
	const response = await orchestratorWithAuthClient.put<PlantillaRespuesta>(
		`/api/templates/organization/${params.idOrg}/upsertTemplate`,
		params.payload
	)

	return response.data
}

// Borrar plantilla de respuesta
export async function deletePlantillaRespuestaApi(
	params: DeletePlantillaRespuesta
) {
	const response = await orchestratorWithAuthClient.delete<string>(
		`/api/templates/organization/${params.idOrg}/deleteTemplate`,
		{ data: params.payload }
	)

	return response.data
}

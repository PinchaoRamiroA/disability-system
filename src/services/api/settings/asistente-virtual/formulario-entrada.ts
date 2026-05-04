import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { OrgAndIdva } from '@/types/OrgAndIdva'
import {
	FormEntrada,
	UpdateFormEntrada,
} from '@/types/Settings/asistente-virtual/FormularioEntrada'

// Obtener configuración de campos del formulario de entrada del Widget
export const getFormEntradaApi = async ({ idOrg, idVa }: OrgAndIdva) => {
	const response = await orchestratorWithAuthClient.get<FormEntrada[]>(
		`/api/organization/${idOrg}/agent/getEntryFormComplete?idVa=${idVa}`
	)
	return response.data
}

// Actualizar configuración (agregar/remover) de campos del formulario de entrada del Widget
export async function updateFormEntradaFieldApi(params: UpdateFormEntrada) {
	const response = await orchestratorWithAuthClient.put<FormEntrada[]>(
		`/api/organization/${params.idOrg}/agent/updateEntryFormComplete?idVa=${params.idVa}`,
		params.payload
	)

	return response.data
}

// Reordena el array del formulario de entrada
export async function sortFormEntradaFieldApi(params: UpdateFormEntrada) {
	const response = await orchestratorWithAuthClient.put<FormEntrada[]>(
		`/api/organization/${params.idOrg}/agent/updateEntryFormOrder?idVa=${params.idVa}`,
		params.payload
	)

	return response.data
}

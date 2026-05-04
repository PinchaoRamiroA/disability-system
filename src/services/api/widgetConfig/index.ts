import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	GetWidgetAvatar,
	GetWidgetConfig,
	UpdateWidgetAvatar,
	UpdateWidgetAvatarResponse,
	UpdateWidgetConfig,
	WidgetConfigRaw,
} from '@/types/Settings/General/Widget'

// Obtener configuración actual del widget
export const getWidgetConfig = async (params: GetWidgetConfig) => {
	const response = await orchestratorWithAuthClient.get<WidgetConfigRaw>(
		`api/organization/${params.idOrg}/colorFont/getWidgetDesign`,
		{
			params: {
				idVa: params.idVa,
			},
		}
	)

	return response.data
}

// Actualizar configuración del widget
export async function updateWidgetConfig(params: UpdateWidgetConfig) {
	const response = await orchestratorWithAuthClient.post<WidgetConfigRaw>(
		`api/organization/${params.idOrg}/colorFont/updateWidgetDesign`,
		params.payload
	)

	return response.data
}

/**
 * Avatar
 */
// Obtener avatar actual del widget
export const getWidgetAvatar = async (params: GetWidgetAvatar) => {
	const { idOrg, idVa } = params
	const response = await orchestratorWithAuthClient.get<string>(
		`api/organization/${idOrg}/colorFont/getImage`,
		{
			params: {
				idVa,
			},
		}
	)

	return response.data
}

// Actualizar avatar del widget
export async function updateWidgetAvatar(params: UpdateWidgetAvatar) {
	const response =
		await orchestratorWithAuthClient.post<UpdateWidgetAvatarResponse>(
			`api/organization/${params.idOrg}/colorFont/upsertImage?idVa=${params.payload.idVa}`,
			{
				url: params.payload.nameImage,
			}
		)

	return response.data
}

import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	GetDashboardConfig,
	UpdateDashboardLogo,
	UpdateDashboardConfig,
	DashboardConfig,
	UpdateDashboardLogoResponse,
} from '@/types/Settings/General/Dashboard'

// Obtener configuración actual del dashboard
export const getDashboardConfig = async ({ idOrg }: GetDashboardConfig) => {
	const response =
		await orchestratorWithAuthClient.get<DashboardConfig | null>(
			`api/organization/${idOrg}/dashboardDesign/getDashboardDesign`
		)

	return response.data
}

// Actualizar configuración del dashboard
export async function updateDashboardConfig(params: UpdateDashboardConfig) {
	const response = await orchestratorWithAuthClient.post<DashboardConfig>(
		`api/organization/${params.idOrg}/dashboardDesign/updateDashboardDesign`,
		params.payload
	)

	return response.data
}

/**
 * Logo
 */
// Obtener logo actual del dashboard
export const getDashboardLogo = async ({ idOrg }: GetDashboardConfig) => {
	const response = await orchestratorWithAuthClient.get<string>(
		`api/organization/${idOrg}/dashboardDesign/getDashboardImage`
	)

	return response.data
}

// Actualizar logo del dashboard
export async function updateDashboardLogo(params: UpdateDashboardLogo) {
	const response =
		await orchestratorWithAuthClient.post<UpdateDashboardLogoResponse>(
			`api/organization/${params.idOrg}/dashboardDesign/updateDashboardtImage`,
			{
				url: params.payload.nameImage,
			}
		)

	return response.data
}

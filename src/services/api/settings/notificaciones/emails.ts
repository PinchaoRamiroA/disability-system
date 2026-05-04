import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { IdOrgParam } from '@/types/auth'
import {
	EmailsConfig,
	EmailsConfigCreate,
	EmailsConfigDelete,
	EmailsConfigUpdate,
} from '@/types/Notificaciones'

// Obtener emails
export const getEmailsAPI = async ({ idOrg }: IdOrgParam) => {
	const response = await orchestratorWithAuthClient.get<EmailsConfig[]>(
		`/api/organization/${idOrg}/emailsNotifications/getEmailsNotifications`
	)

	return response.data
}

// Crear email
export async function createEmailAPI(params: EmailsConfigCreate) {
	const response = await orchestratorWithAuthClient.post<EmailsConfig>(
		`/api/organization/${params.idOrg}/emailsNotifications/createEmailNotifications`,
		params.data
	)

	return response.data
}

// Actualizar email
export async function updateEmailAPI(params: EmailsConfigUpdate) {
	const response = await orchestratorWithAuthClient.put<EmailsConfig>(
		`/api/organization/${params.idOrg}/emailsNotifications/updateEmailNotifications`,
		params.payload
	)

	return response.data
}

// Eliminar email
export async function deleteEmailAPI({ idEmail, idOrg }: EmailsConfigDelete) {
	const response = await orchestratorWithAuthClient.delete<EmailsConfig>(
		`/api/organization/${idOrg}/emailsNotifications/deleteteEmailNotifications?idEmail=${idEmail}`
	)

	return response.data
}

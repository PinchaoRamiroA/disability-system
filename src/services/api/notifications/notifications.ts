import { notificationsWithAuthClient } from '@/services/api/utilities/instances'
import {
	NotificationTypes,
	Notifications,
	NotificationsEvents,
	NotificationsEventsParams,
	NotificationsParams,
} from '@/types/Notifications'
import { EventsConfig, UpsertTemplateParams } from '@/types/Notificaciones'

export async function getNotifications(
	idOrg: number,
	params: NotificationsParams
) {
	const response = await notificationsWithAuthClient.get<Notifications>(
		`/api/statistics/notificationsByStatus/company/${idOrg}`,
		{ params }
	)

	return response.data
}

export async function getNotificationTypes(idOrg: number) {
	const response = await notificationsWithAuthClient.get<NotificationTypes>(
		`/api/types/notifications/company/${idOrg}`
	)

	return response.data
}

// Eventos
export async function getNotificationEvents(
	idOrg: number,
	params: NotificationsEventsParams
) {
	const response = await notificationsWithAuthClient.get<NotificationsEvents>(
		`/api/statistics/eventsByTypeEventRole/company/${idOrg}`,
		{ params }
	)

	return response.data
}
export async function getNotificationsConfig(idOrg: number) {
	const response = await notificationsWithAuthClient.get<EventsConfig[]>(
		'/config/getTemplatesByCompany',
		{
			params: {
				companyId: idOrg,
			},
		}
	)
	return response.data
}

export async function DeleteNotificationsConfig(idNotification: string) {
	try {
		const response = await notificationsWithAuthClient.delete(
			`/config/deleteTemplate/${idNotification}`
		)
		return response.data
	} catch (error) {
		console.error('Error al eliminar la notificación:', error)
		throw error
	}
}

export async function upsertNotificationConfig(body: UpsertTemplateParams) {
	const response = await notificationsWithAuthClient.post<EventsConfig[]>(
		'/config/upsertTemplatesByCompanyAndEventType',
		body
	)
	return response.data
}

export async function ListTemplates(TypeNotification: string, idOrg: number) {
	const response = await notificationsWithAuthClient.get(
		'/config/getTemplatesByCompany',
		{
			params: {
				companyId: idOrg,
				TypeNotification: TypeNotification,
			},
		}
	)
	return response.data
}

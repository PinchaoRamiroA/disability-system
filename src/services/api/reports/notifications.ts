import { notificationsWithAuthClient } from '@/services/api/utilities/instances'
import {
	NotificationLogs,
	NotificationReportArgs,
} from '@/types/reports/notifications/Notifications'

export async function getNotificationsLog(args: NotificationReportArgs) {
	const { idOrg, params } = args

	const response = await notificationsWithAuthClient.get<NotificationLogs>(
		`/api/statistics/notificationsLog/company/${idOrg}`,
		{ params }
	)

	return response.data
}

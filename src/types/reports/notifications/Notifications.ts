import { DatesParams } from '@/types/Filter/FilterParams'

export interface NotificationReportArgs {
	idOrg: number
	params: DatesParams
}

export interface NotificationLogs {
	notificationsLog: Log[]
	totalPages: number
	totalResult: number
}

export interface Log {
	event: string
	role: string
	notificationType: string
	to: string
	status: string
	error: null | string
	date: string
}

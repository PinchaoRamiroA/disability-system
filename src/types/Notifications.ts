import { DatesParams } from './Filter/FilterParams'

export interface Notifications {
	data: NotifData[]
	summary: Summary[]
}

export interface NotifData {
	idTypeNotification: number
	detail: Detail[]
}

export interface Detail {
	date: string
	status: Status
}

export interface Status {
	ok: number
	error: number
}

export interface Summary {
	idTypeNotification: number
	count: number
}

export interface NotificationsParams extends DatesParams {
	idTypeNotification?: number[]
}

export interface NotificationTypes {
	types: Type[]
}

export interface Type {
	typeNotificationId: number
	name: string
	checked: boolean
}

export interface NotificationsEventsParams extends DatesParams {
	idTypeNotification?: number[]
}

export interface NotificationsEvents {
	count: number
	detail: EventsDetail[]
}

export interface EventsDetail {
	eventName: string
	roleEvent: string
	detail: Detail[]
}

export interface Detail {
	idTypeNotification: number
	count: number
}
export interface ParamNotifyConfig {
	companyId?: number
}

export interface EventsConfig {
	[key: string]: string | number | null
	id: number
	type_event: string
	code_template: string
	type_notifications: string
	message: string | null // El mensaje puede ser nulo según los datos
}

export interface UpsertTemplateParams {
	companyId: number | string
	eventType: string
	TypeNotification: string
	codeTemplate: string
	BodySms?: string // bodySms es opcional
	id?: number | string // id es opcional
}

export interface EmailsConfig {
	[key: string]: string | number
	id: string
	email: string
	idEmail: number
	namePerson: string
}

export interface EmailsConfigCreate {
	idOrg: number
	data: {
		email: string
		namePerson: string
	}
}

export interface EmailsConfigUpdate {
	idOrg: number
	payload: {
		idEmail: number
		email?: string
		namePerson?: string
	}
}

export interface EmailsConfigDelete {
	idOrg: number
	idEmail: number
}

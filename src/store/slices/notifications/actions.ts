import * as api from '@/services/api/notifications'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { EnqueueSnackbar } from '@/types/notistack'
import {
	DeleteEvent,
	getEventsError,
	getNotificationTypesError,
	getNotificationsError,
} from '@/utils/constants/snackbars/notifications'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import {
	NotificationTypes,
	Notifications,
	NotificationsEvents,
} from '@/types/Notifications'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

import { EventsConfig, UpsertTemplateParams } from '@/types/Notificaciones'
import { DatesParams } from '@/types/Filter/FilterParams'

interface Args {
	idOrg: number
	params: DatesParams
}

interface EventsArgs {
	idOrg: number
	params: DatesParams
}

export const getNotifications = createAsyncThunk<
	Notifications,
	Args,
	{ rejectValue: EnqueueSnackbar }
>('stats/notifications', async (args, { rejectWithValue }) => {
	try {
		const data: Notifications = await api.getNotifications(
			args.idOrg,
			args.params
		)

		return data
	} catch (err) {
		detectUnauthorized(err, getNotifications(args))
		return rejectWithValue(setEnqueueSnackbar(getNotificationsError, err))
	}
})

// Tipos de notificación
export const getNotificationTypes = createAsyncThunk<
	NotificationTypes,
	{ idOrg: number },
	{ rejectValue: EnqueueSnackbar }
>('stats/notificationsTypes', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getNotificationTypes(params.idOrg)

		return data
	} catch (err) {
		detectUnauthorized(err, getNotificationTypes(params))
		return rejectWithValue(
			setEnqueueSnackbar(getNotificationTypesError, err)
		)
	}
})

// Eventos
export const getNotificationEvents = createAsyncThunk<
	NotificationsEvents,
	EventsArgs,
	{ rejectValue: EnqueueSnackbar }
>('stats/notificationsEvents', async (args, { rejectWithValue }) => {
	try {
		const data: NotificationsEvents = await api.getNotificationEvents(
			args.idOrg,
			args.params
		)

		return data
	} catch (err) {
		detectUnauthorized(err, getNotificationEvents(args))
		return rejectWithValue(setEnqueueSnackbar(getEventsError, err))
	}
})
{
	/**Configuracion notificaciones */
}
export const getNotificaciones = createAsyncThunk<
	EventsConfig[],
	number,
	{ rejectValue: EnqueueSnackbar }
>('notifications/getNotifications', async (id: number, { rejectWithValue }) => {
	try {
		const data = await api.getNotificationsConfig(id)
		return data
	} catch (error) {
		return rejectWithValue(setEnqueueSnackbar(getEventsError, error))
	}
})

export const deleteNotification = createAsyncThunk<
	void,
	string,
	{ rejectValue: EnqueueSnackbar }
>('notifications/deleteNotification', async (id: string) => {
	try {
		await api.DeleteNotificationsConfig(id)
		addSnackbarKey(DeleteEvent)
	} catch (error) {
		//return rejectWithValue(setEnqueueSnackbar(deleteEventError, error));
		console.error(
			'Error al realizar la solicitud de eliminar la plantilla:',
			error
		)
		throw error
	}
})

export async function upsertNotificationTemplate(params: UpsertTemplateParams) {
	try {
		// Construir el objeto requestBody incluyendo solo los campos que tienen valor
		const requestBody: UpsertTemplateParams = {
			companyId: params.companyId,
			eventType: params.eventType,
			TypeNotification: params.TypeNotification,
			codeTemplate: params.codeTemplate,
			...(params.BodySms && { BodySms: params.BodySms }), // Agregar bodySms solo si tiene valor
			...(params.id && { id: params.id }), // Agregar id solo si tiene valor
		}

		const data = await api.upsertNotificationConfig(requestBody)

		return data
	} catch (error) {
		console.error(
			'Error al realizar la solicitud de actualización/creación de plantilla:',
			error
		)

		throw error
	}
}
export async function ListTemplates(TypeNotification: string, idOrg: number) {
	try {
		const data = await api.ListTemplates(TypeNotification, idOrg)

		return data
	} catch (error) {
		console.error('Error al traer la lista:', error)
		throw error
	}
}

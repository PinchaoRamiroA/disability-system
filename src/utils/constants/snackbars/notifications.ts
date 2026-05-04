import { EnqueueSnackbar } from '@/types/notistack'

export const getNotificationsError: EnqueueSnackbar = {
	message: 'Error al obtener notificaciones',
	options: { variant: 'error' },
}

export const getNotificationTypesError: EnqueueSnackbar = {
	message: 'Error al obtener tipos de notificaciones',
	options: { variant: 'error' },
}

export const getEventsError: EnqueueSnackbar = {
	message: 'Error al obtener eventos',
	options: { variant: 'error' },
}

export const getLogError: EnqueueSnackbar = {
	message: 'Error al obtener el log de notificaciones',
	options: { variant: 'error' },
}

export const updateEventSuccess: EnqueueSnackbar = {
	message: 'El evento se actualizó correctamente.',
	options: { variant: 'success' },
}
export const CreateEventSuccess: EnqueueSnackbar = {
	message: 'El evento se creo correctamente.',
	options: { variant: 'success' },
}
export const DeleteEvent: EnqueueSnackbar = {
	message: 'El evento se elimino correctamente.',
	options: { variant: 'success' },
}

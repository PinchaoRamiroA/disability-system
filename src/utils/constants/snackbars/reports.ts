import { EnqueueSnackbar } from '@/types/notistack'

export const getAccessError: EnqueueSnackbar = {
	message: 'Error al cargar log de accesos',
	options: { variant: 'error' },
}

export const getAccessDownloadError: EnqueueSnackbar = {
	message: 'Error al descargar log de accesos',
	options: { variant: 'error' },
}

export const getHistoryError: EnqueueSnackbar = {
	message: 'Error al cargar historial',
	options: { variant: 'error' },
}

export const getHistoryDownloadError: EnqueueSnackbar = {
	message: 'Error al descargar histórico',
	options: { variant: 'error' },
}

export const getInteractionHistoryError: EnqueueSnackbar = {
	message: 'Error al cargar historial de interacciones',
	options: { variant: 'error' },
}

export const getChatsError: EnqueueSnackbar = {
	message: 'Error al cargar chats',
	options: { variant: 'error' },
}

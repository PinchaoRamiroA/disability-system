import { EnqueueSnackbar } from '@/types/notistack'

export const getParametrosError: EnqueueSnackbar = {
	message: 'Error al obtener parámetros',
	options: { variant: 'error' },
}

// Actualizar
export const updateParametrosSuccess: EnqueueSnackbar = {
	message: 'Número de chats actualizado',
	options: { variant: 'success' },
}
export const updateParametrosError: EnqueueSnackbar = {
	message: 'Error al actualizar el número de chats',
	options: { variant: 'error' },
}

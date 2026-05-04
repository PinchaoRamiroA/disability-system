import { EnqueueSnackbar } from '@/types/notistack'

export const getMensajesError: EnqueueSnackbar = {
	message: 'Error al obtener mensajes',
	options: { variant: 'error' },
}

// Actualizar
export const updateMensajeSuccess: EnqueueSnackbar = {
	message: 'Mensaje actualizado',
	options: { variant: 'success' },
}

export const updateMensajeError: EnqueueSnackbar = {
	message: 'No se pudo actualizar el mensaje',
	options: { variant: 'error' },
}

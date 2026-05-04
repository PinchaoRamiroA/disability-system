import { EnqueueSnackbar } from '@/types/notistack'

export const getPauseEventsError: EnqueueSnackbar = {
	message: 'Error al cargar los eventos de pausa',
	options: { variant: 'error' },
}

// Crear
export const createPauseEventSuccess: EnqueueSnackbar = {
	message: 'Evento de pausa creado',
	options: { variant: 'success' },
}
export const createPauseEventError: EnqueueSnackbar = {
	message: 'Error al crear evento de pausa',
	options: { variant: 'error' },
}

// Actualizar
export const updatePauseEventSuccess: EnqueueSnackbar = {
	message: 'Evento de pausa actualizado',
	options: { variant: 'success' },
}
export const updatePauseEventError: EnqueueSnackbar = {
	message: 'Error al actualizar evento de pausa',
	options: { variant: 'error' },
}

// Borrar
export const deletePauseEventSuccess: EnqueueSnackbar = {
	message: 'Evento de pausa eliminado',
	options: { variant: 'success' },
}
export const deletePauseEventError: EnqueueSnackbar = {
	message: 'Error al eliminar evento de pausa',
	options: { variant: 'error' },
}

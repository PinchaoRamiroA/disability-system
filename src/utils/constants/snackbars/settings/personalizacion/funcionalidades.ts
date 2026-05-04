import { EnqueueSnackbar } from '@/types/notistack'

export const getFeaturesError: EnqueueSnackbar = {
	message: 'Error al obtener estado de funcionalidades.',
	options: { variant: 'error' },
}

// Actualizar
export const updateFeatureSuccess: EnqueueSnackbar = {
	message: 'Funcionalidad actualizada con éxito.',
	options: { variant: 'success' },
}

export const updateFeatureError: EnqueueSnackbar = {
	message: 'Error al actualizar funcionalidad.',
	options: { variant: 'error' },
}

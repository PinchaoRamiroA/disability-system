import { EnqueueSnackbar } from '@/types/notistack'

export const getPlantillasError: EnqueueSnackbar = {
	message: 'Error al obtener plantilllas de respuesta.',
	options: { variant: 'error' },
}

// Crear
export const createPlantillaSuccess: EnqueueSnackbar = {
	message: 'Plantilla de repuesta creada.',
	options: { variant: 'success' },
}

export const createPlantillaError: EnqueueSnackbar = {
	message: 'Se ha producido un error al crear la plantilla de respuesta.',
	options: { variant: 'error' },
}

// Actualizar
export const updatePlantillaSuccess: EnqueueSnackbar = {
	message: 'Plantilla de repuesta actualizada.',
	options: { variant: 'success' },
}

export const updatePlantillaError: EnqueueSnackbar = {
	message:
		'Se ha producido un error al actualizar la plantilla de respuesta.',
	options: { variant: 'error' },
}

// Eliminar
export const deletePlantillaSuccess: EnqueueSnackbar = {
	message: 'Plantilla de repuesta eliminada.',
	options: { variant: 'success' },
}

export const deletePlantillaError: EnqueueSnackbar = {
	message: 'Se ha producido un error al eliminar la plantilla de respuesta.',
	options: { variant: 'error' },
}

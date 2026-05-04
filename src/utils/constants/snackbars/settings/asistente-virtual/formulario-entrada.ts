import { EnqueueSnackbar } from '@/types/notistack'

export const getFormEntradaError: EnqueueSnackbar = {
	message: 'Error al obtener configuración del formulario.',
	options: { variant: 'error' },
}

// Actualizar
export const updateFormFieldSuccess: EnqueueSnackbar = {
	message: 'Campo agregado con éxito.',
	options: { variant: 'success' },
}

export const updateFormFieldError: EnqueueSnackbar = {
	message: 'Error al agregar el campo al formulario de entrada.',
	options: { variant: 'error' },
}

// Eliminar
export const deleteFormFieldSuccess: EnqueueSnackbar = {
	message: 'Campo removido con éxito.',
	options: { variant: 'success' },
}

export const deleteFormFieldError: EnqueueSnackbar = {
	message: 'Error al remover el campo del formulario de entrada.',
	options: { variant: 'error' },
}

// Reordenar
export const sortFormError: EnqueueSnackbar = {
	message: 'Error al reordenar el formulario de entrada.',
	options: { variant: 'error' },
}

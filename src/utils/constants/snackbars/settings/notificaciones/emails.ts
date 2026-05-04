import { EnqueueSnackbar } from '@/types/notistack'

export const getEmailsError: EnqueueSnackbar = {
	message: 'Error al obtener configuración de correos.',
	options: { variant: 'error' },
}

// Crear
export const createEmailSuccess: EnqueueSnackbar = {
	message: 'Email creado con éxito.',
	options: { variant: 'success' },
}

export const createEmailError: EnqueueSnackbar = {
	message: 'Error al crear email.',
	options: { variant: 'error' },
}

// Actualizar
export const updateEmailSuccess: EnqueueSnackbar = {
	message: 'Email actualizado con éxito.',
	options: { variant: 'success' },
}

export const updateEmailError: EnqueueSnackbar = {
	message: 'Error al actualizar email.',
	options: { variant: 'error' },
}

// Eliminar
export const deleteEmailSuccess: EnqueueSnackbar = {
	message: 'Email eliminado.',
	options: { variant: 'success' },
}

export const deleteEmailError: EnqueueSnackbar = {
	message: 'Error al eliminar email.',
	options: { variant: 'error' },
}

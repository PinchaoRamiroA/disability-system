import { EnqueueSnackbar } from '@/types/notistack'

// Obtener directorio
export const getContactsError: EnqueueSnackbar = {
	message: 'Error al obtener lista de contactos.',
	options: { variant: 'error' },
}

// Crear
export const createContactSuccess: EnqueueSnackbar = {
	message: 'Contacto creado con éxito.',
	options: { variant: 'success' },
}

export const createContactError: EnqueueSnackbar = {
	message: 'Se ha producido un error al crear el nuevo contacto.',
	options: { variant: 'error' },
}

// Actualizar
export const updateContactSuccess: EnqueueSnackbar = {
	message: 'Contacto actualizado con éxito.',
	options: { variant: 'success' },
}

export const updateContactError: EnqueueSnackbar = {
	message: 'Se ha producido un error al actualizar el contacto.',
	options: { variant: 'error' },
}

// Eliminar
export const deleteContactSuccess: EnqueueSnackbar = {
	message: 'Contacto eliminado correctamente.',
	options: { variant: 'success' },
}

export const deleteContactError: EnqueueSnackbar = {
	message: 'Se ha producido un error al eliminar el contacto.',
	options: { variant: 'error' },
}

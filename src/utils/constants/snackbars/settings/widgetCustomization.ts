import { EnqueueSnackbar } from '@/types/notistack'

// Obtener colores y fuentes del widget
export const getConfigError: EnqueueSnackbar = {
	message: 'Error al obtener configuración',
	options: { variant: 'error' },
}

// Obtener avatar del widget
export const getAvatarError: EnqueueSnackbar = {
	message: 'Error al obtener avatar',
	options: { variant: 'error' },
}

// Actualizar configuración
export const updateConfigSuccess: EnqueueSnackbar = {
	message: 'Configuración actualizada exitosamente',
	options: { variant: 'success' },
}
export const updateConfigError: EnqueueSnackbar = {
	message: 'Error al actualizar configuración del widget',
	options: { variant: 'error' },
}

// Actualizar avatar
export const updateAvatarSuccess: EnqueueSnackbar = {
	message: 'Avatar actualizado exitosamente',
	options: { variant: 'success' },
}
export const updateAvatarError: EnqueueSnackbar = {
	message: 'Error al actualizar avatar',
	options: { variant: 'error' },
}

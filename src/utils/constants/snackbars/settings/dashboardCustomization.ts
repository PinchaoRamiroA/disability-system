import { EnqueueSnackbar } from '@/types/notistack'

// Obtener colores y fuentes del dashboard
export const getConfigError: EnqueueSnackbar = {
	message: 'Error al obtener configuración',
	options: { variant: 'error' },
}

// Obtener logo del dashboard
export const getLogoError: EnqueueSnackbar = {
	message: 'Error al obtener logo',
	options: { variant: 'error' },
}

// Actualizar configuración
export const updateConfigSuccess: EnqueueSnackbar = {
	message: 'Configuración actualizada exitosamente',
	options: { variant: 'success' },
}
export const updateConfigError: EnqueueSnackbar = {
	message: 'Error al actualizar configuración del dashboard',
	options: { variant: 'error' },
}

// Actualizar logo
export const updateLogoSuccess: EnqueueSnackbar = {
	message: 'Logo actualizado exitosamente',
	options: { variant: 'success' },
}
export const updateLogoError: EnqueueSnackbar = {
	message: 'Error al actualizar logo',
	options: { variant: 'error' },
}

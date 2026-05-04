import { EnqueueSnackbar } from '@/types/notistack'

export const getExpiracionError: EnqueueSnackbar = {
	message: 'Error al obtener configuración de expiración de sesión',
	options: { variant: 'error' },
}

// Actualizar
export const updateExpiracionSuccess: EnqueueSnackbar = {
	message: 'Configuración de expiración actualizada',
	options: { variant: 'success' },
}

export const updateExpiracionError: EnqueueSnackbar = {
	message: 'No se pudo actualizar la configuración de expiración de sesión',
	options: { variant: 'error' },
}

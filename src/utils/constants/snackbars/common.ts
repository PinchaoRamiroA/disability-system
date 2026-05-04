import { EnqueueSnackbar } from '@/types/notistack'

/**
 * documentation: https://iamhosseindhv.com/notistack/demos
 */

export const serverError: EnqueueSnackbar = {
	message: 'Se ha presentado un error en el servidor. Inténtelo mas tarde',
	options: { variant: 'error' },
}

// 401 unauthorized
// export const unauthorizedError: EnqueueSnackbar = {
//   message: 'Usuario no autenticado',
//   options: { variant: 'error' },
// }

// 403 forbidden
export const forbiddenError: EnqueueSnackbar = {
	message: 'Usuario no autorizado',
	options: { variant: 'error' },
}

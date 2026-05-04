import { EnqueueSnackbar } from '@/types/notistack'

/**
 * documentation: https://iamhosseindhv.com/notistack/demos
 */

export const authError: EnqueueSnackbar = {
	message: 'Usuario o contraseña inválidos',
	options: {
		variant: 'error',
		anchorOrigin: {
			vertical: 'top',
			horizontal: 'center',
		},
	},
}

export const lockedError: EnqueueSnackbar = {
	message: 'Usuario ha sido bloqueado',
	options: {
		variant: 'error',
		anchorOrigin: {
			vertical: 'top',
			horizontal: 'center',
		},
	},
}

export const checkPasswordChangeError: EnqueueSnackbar = {
	message:
		'Error al validar la contraseña, por favor comuníquese con un Administrador.',
	options: {
		variant: 'error',
		anchorOrigin: {
			vertical: 'top',
			horizontal: 'center',
		},
	},
}

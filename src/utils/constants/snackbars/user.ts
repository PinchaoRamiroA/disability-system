import { EnqueueSnackbar } from '@/types/notistack'

/**
 * documentation: https://iamhosseindhv.com/notistack/demos
 */

export const getUsersError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de usuarios',
	options: { variant: 'error' },
}

export const createUserError: EnqueueSnackbar = {
	message: 'Error al crear el usuario',
	options: { variant: 'error' },
}

export const createDuplicatedUserError: EnqueueSnackbar = {
	message:
		'El nombre de usuario ingresado no está disponible, inténtelo nuevamente',
	options: { variant: 'error' },
}

export const createUserSuccess: EnqueueSnackbar = {
	message: 'Usuario creado exitosamente',
	options: { variant: 'success' },
}

export const putUserError: EnqueueSnackbar = {
	message: 'Error al actualizar el usuario',
	options: { variant: 'error' },
}

export const putUserSuccess: EnqueueSnackbar = {
	message: 'Usuario actualizado exitosamente',
	options: { variant: 'success' },
}

export const deleteUserError: EnqueueSnackbar = {
	message: 'Error al eliminar el usuario',
	options: { variant: 'error' },
}

export const deleteUserSuccess: EnqueueSnackbar = {
	message: 'Usuario eliminado exitosamente',
	options: { variant: 'success' },
}
export const updateUserPasswordError: EnqueueSnackbar = {
	message: 'Error al actualizar la contraseña.',
	options: { variant: 'error' },
}

export const incorrectPasswordError: EnqueueSnackbar = {
	message: 'La contraseña Actual no es válida.',
	options: { variant: 'error' },
}

export const updateUserPasswordSuccess: EnqueueSnackbar = {
	message: 'La contraseña se actualizó correctamente.',
	options: { variant: 'success' },
}

/**
 * Parameters locked
 */
export const getParamBloqueoError: EnqueueSnackbar = {
	message: 'Error al obtener el parámetro de bloqueo.',
	options: { variant: 'error' },
}
export const updateParamBloqueoSuccess: EnqueueSnackbar = {
	message: 'Parámetro de bloqueo actualizado exitosamente.',
	options: { variant: 'success' },
}
export const updateParamBloqueoError: EnqueueSnackbar = {
	message: 'Error al actualizar el parámetro de bloqueo.',
	options: { variant: 'error' },
}

/**
 * Parámetro de caducidad de contraseña
 */
export const getParamCaducidadError: EnqueueSnackbar = {
	message: 'Error al obtener el parámetro de caducidad.',
	options: { variant: 'error' },
}
export const updateParamCaducidadSuccess: EnqueueSnackbar = {
	message: 'Parámetro de caducidad de contraseña actualizado exitosamente.',
	options: { variant: 'success' },
}
export const updateParamCaducidadError: EnqueueSnackbar = {
	message: 'Error al actualizar el parámetro de caducidad de contraseña.',
	options: { variant: 'error' },
}

/** config Event notification */
export const CreateEventSuccess: EnqueueSnackbar = {
	message: 'El evento se creo correctamente.',
	options: { variant: 'success' },
}
export const UpdateEventSuccess: EnqueueSnackbar = {
	message: 'El evento se actualizo correctamente.',
	options: { variant: 'success' },
}
export const DeleteEventSuccess: EnqueueSnackbar = {
	message: 'El evento se elimino correctamente.',
	options: { variant: 'success' },
}

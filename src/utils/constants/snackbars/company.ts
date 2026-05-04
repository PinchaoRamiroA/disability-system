import { EnqueueSnackbar } from '@/types/notistack'

/**
 * documentation: https://iamhosseindhv.com/notistack/demos
 */

export const getCompaniesError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de compañías',
	options: { variant: 'error' },
}
export const createCompanyError: EnqueueSnackbar = {
	message: 'Error al crear la compañía',
	options: { variant: 'error' },
}
export const createCompanySuccess: EnqueueSnackbar = {
	message: 'Compañía creada exitosamente',
	options: { variant: 'success' },
}
export const putCompanyError: EnqueueSnackbar = {
	message: 'Error al actualizar la compañía',
	options: { variant: 'error' },
}
export const putCompanySuccess: EnqueueSnackbar = {
	message: 'Compañía actualizada exitosamente',
	options: { variant: 'success' },
}
export const deleteCompanyError: EnqueueSnackbar = {
	message: 'Error al eliminar la compañía',
	options: { variant: 'error' },
}

export const deleteCompanySuccess: EnqueueSnackbar = {
	message: 'Compañía eliminada exitosamente',
	options: { variant: 'success' },
}

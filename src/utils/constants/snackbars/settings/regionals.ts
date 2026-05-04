import { EnqueueSnackbar } from '@/types/notistack'

export const getLocationsError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de regionales/departamentos',
	options: { variant: 'error' },
}

export const createRegionalsError: EnqueueSnackbar = {
	message: 'Error al crear regional',
	options: { variant: 'error' },
}

export const updateRegionalsError: EnqueueSnackbar = {
	message: 'Error al actualizar regional',
	options: { variant: 'error' },
}

export const deleteRegionalsError: EnqueueSnackbar = {
	message: 'Error al eliminar regional',
	options: { variant: 'error' },
}

export const updateDepartmentError: EnqueueSnackbar = {
	message: 'Error al actualizar departamento',
	options: { variant: 'error' },
}

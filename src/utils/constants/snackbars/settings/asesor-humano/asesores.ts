import { EnqueueSnackbar } from '@/types/notistack'

export const updateSplitsSuccess: EnqueueSnackbar = {
	message: 'Splits actualizados con éxito.',
	options: { variant: 'success' },
}

export const updateSplitsError: EnqueueSnackbar = {
	message: 'Error al actualizar splits .',
	options: { variant: 'error' },
}

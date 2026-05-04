import { EnqueueSnackbar } from '@/types/notistack'

export const getGoogleFontsError: EnqueueSnackbar = {
	message: 'Error al cargar Google Fonts',
	options: { variant: 'error' },
}

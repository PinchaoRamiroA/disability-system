import { EnqueueSnackbar } from '@/types/notistack'

export const getIntegrationsError: EnqueueSnackbar = {
	message: 'Error al cargar Log de Integraciones',
	options: { variant: 'error' },
}

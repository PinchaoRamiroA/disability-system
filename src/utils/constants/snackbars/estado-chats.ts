import { EnqueueSnackbar } from '@/types/notistack'

export const getEstadoChatsError: EnqueueSnackbar = {
	message: 'Error al obtener chats',
	options: { variant: 'error' },
}

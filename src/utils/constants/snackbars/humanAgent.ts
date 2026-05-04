import { EnqueueSnackbar } from '@/types/notistack'

export const geChatsError: EnqueueSnackbar = {
	message: 'Error al cargar chats',
	options: { variant: 'error' },
}
export const getEscalatedChatsError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de chats escalados',
	options: { variant: 'error' },
}
export const getAvgTimeError: EnqueueSnackbar = {
	message: 'Error al cargar el tiempo promedio de los asesores',
	options: { variant: 'error' },
}

export const getAgentsChatsError: EnqueueSnackbar = {
	message: 'Error al cargar los chats por asesor',
	options: { variant: 'error' },
}

export const getEstadoError: EnqueueSnackbar = {
	message: 'Error al cargar los estados de los asesores',
	options: { variant: 'error' },
}

export const getEstadoHistoricoError: EnqueueSnackbar = {
	message: 'Error al cargar el histórico de los asesores',
	options: { variant: 'error' },
}

export const getSplitsTransferenciaError: EnqueueSnackbar = {
	message: 'Error al obtener los splits para transferencia',
	options: { variant: 'error' },
}

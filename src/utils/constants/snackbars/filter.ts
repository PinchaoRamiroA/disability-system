import { EnqueueSnackbar } from '@/types/notistack'

/**
 * documentation: https://iamhosseindhv.com/notistack/demos
 */

export const getChannelsError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de canales',
	options: { variant: 'error' },
}

export const getDocumentTypesError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de documentos',
	options: { variant: 'error' },
}

export const getIntentsError: EnqueueSnackbar = {
	message: 'Error al cargar la lista de intenciones',
	options: { variant: 'error' },
}

export const getIntentsRatingError: EnqueueSnackbar = {
	message: 'Error al obtener calificaciones',
	options: { variant: 'error' },
}

export const getChatConversationsError: EnqueueSnackbar = {
	message: 'Error al cargar las estadísticas de conversaciones',
	options: { variant: 'error' },
}

export const getInteractionsAVGError: EnqueueSnackbar = {
	message: 'Error al cargar el promedio por interacción',
	options: { variant: 'error' },
}

export const getIdVaError: EnqueueSnackbar = {
	message: 'Error al obtener asesores virtuales',
	options: { variant: 'error' },
}

export const getEventsError: EnqueueSnackbar = {
	message: 'Error al cargar eventos',
	options: { variant: 'error' },
}

export const getAgentsError: EnqueueSnackbar = {
	message: 'Error al cargar asesores',
	options: { variant: 'error' },
}

/**
 * Splits
 */
export const getSplitsError: EnqueueSnackbar = {
	message: 'Error al cargar Splits',
	options: { variant: 'error' },
}

export const createSplitError: EnqueueSnackbar = {
	message: 'Error al crear Split',
	options: { variant: 'error' },
}

export const updateSplitError: EnqueueSnackbar = {
	message: 'Error al actualizar Split',
	options: { variant: 'error' },
}

export const deleteSplitError: EnqueueSnackbar = {
	message: 'Error al eliminar Split',
	options: { variant: 'error' },
}

export const createSplit: EnqueueSnackbar = {
	message: 'Split creado',
	options: { variant: 'success' },
}

export const updateSplit: EnqueueSnackbar = {
	message: 'Split actualizado',
	options: { variant: 'success' },
}

export const deleteSplit: EnqueueSnackbar = {
	message: 'Split eliminado',
	options: { variant: 'success' },
}

/**
 * Horarios de atención por split
 */
export const createSplitSchedule: EnqueueSnackbar = {
	message: 'Horario creado',
	options: { variant: 'success' },
}

export const updateSplitSchedule: EnqueueSnackbar = {
	message: 'Horario actualizado',
	options: { variant: 'success' },
}

export const deleteSplitSchedule: EnqueueSnackbar = {
	message: 'Horario eliminado',
	options: { variant: 'success' },
}

export const createSplitScheduleError: EnqueueSnackbar = {
	message: 'Error al crear horario',
	options: { variant: 'error' },
}

export const updateSplitScheduleError: EnqueueSnackbar = {
	message: 'Error al actualizar horario',
	options: { variant: 'error' },
}

export const deleteSplitScheduleError: EnqueueSnackbar = {
	message: 'Error al eliminar horario',
	options: { variant: 'error' },
}

/**
 * Derivación de split
 */
export const createSplitDerive: EnqueueSnackbar = {
	message: 'Split agregado a lista de derivados',
	options: { variant: 'success' },
}

export const updateSplitDerive: EnqueueSnackbar = {
	message: 'Derivaciones actualizadas',
	options: { variant: 'success' },
}

export const deleteSplitDerive: EnqueueSnackbar = {
	message: 'Derivación eliminada',
	options: { variant: 'success' },
}

export const createSplitDeriveError: EnqueueSnackbar = {
	message: 'Error al crear derivación',
	options: { variant: 'error' },
}

export const updateSplitDeriveError: EnqueueSnackbar = {
	message: 'Error al actualizar derivaciones',
	options: { variant: 'error' },
}

export const deleteSplitDeriveError: EnqueueSnackbar = {
	message: 'Error al eliminar derivación',
	options: { variant: 'error' },
}

import { EnqueueSnackbar } from '@/types/notistack'

export const getCausalesError: EnqueueSnackbar = {
	message: 'Error al obtener causales',
	options: { variant: 'error' },
}

// Crear
export const createCausalSuccess: EnqueueSnackbar = {
	message: 'Causales de conversación registrados',
	options: { variant: 'success' },
}
export const createCausalError: EnqueueSnackbar = {
	message: 'Error al registrar causales de conversación',
	options: { variant: 'error' },
}

// Crear causal finalización
export const createCausalFinSuccess: EnqueueSnackbar = {
	message: 'Causal de finalización registrado',
	options: { variant: 'success' },
}
export const createCausalFinError: EnqueueSnackbar = {
	message: 'Error al registrar causal de finalización',
	options: { variant: 'error' },
}

// Actualizar
export const updateCausalSuccess: EnqueueSnackbar = {
	message: 'Causal actualizado',
	options: { variant: 'success' },
}
export const updateCausalError: EnqueueSnackbar = {
	message: 'Error al actualizar causal',
	options: { variant: 'error' },
}

// Borrar
export const deleteCausalSuccess: EnqueueSnackbar = {
	message: 'Causal eliminado',
	options: { variant: 'success' },
}
export const deleteCausalError: EnqueueSnackbar = {
	message: 'Error al eliminar causal',
	options: { variant: 'error' },
}

// Estadística
export const estadisticaPasoAutomaticoError: EnqueueSnackbar = {
	message: 'Error al obtener estadística de causales de paso automático',
	options: { variant: 'error' },
}
export const estadisticaCausalNegocioError: EnqueueSnackbar = {
	message: 'Error al obtener estadística de causales de la conversación',
	options: { variant: 'error' },
}
export const estadisticaCausalFinError: EnqueueSnackbar = {
	message: 'Error al obtener estadística de causales de finalización',
	options: { variant: 'error' },
}

// Reporte
export const reporteCausalError: EnqueueSnackbar = {
	message: 'Error al obtener reporte',
	options: { variant: 'error' },
}

import { EnqueueSnackbar } from '@/types/notistack'

export const getFCRError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador FCR',
	options: { variant: 'error' },
}

export const getTMAsignacionError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador TM Asignación',
	options: { variant: 'error' },
}

export const getTMAtencionAHError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador TM Atención asesor humano',
	options: { variant: 'error' },
}

export const getTMAtencionAVError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador TM Atención asesor virtual',
	options: { variant: 'error' },
}

export const getTMOError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador TMO',
	options: { variant: 'error' },
}

export const getFaltaRespuestaBotError: EnqueueSnackbar = {
	message:
		'Error al cargar el indicador de Nivel de falta de respuesta del BOT',
	options: { variant: 'error' },
}

export const getNivelAbandonoError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador de Nivel de abandono',
	options: { variant: 'error' },
}

export const getNSError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador Nivel de satisfacción',
	options: { variant: 'error' },
}

export const getRUError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador Recurrencia de usuarios',
	options: { variant: 'error' },
}

export const getNPSError: EnqueueSnackbar = {
	message: 'Error al cargar el indicador Net promote score',
	options: { variant: 'error' },
}

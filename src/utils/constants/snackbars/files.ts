import { EnqueueSnackbar } from '@/types/notistack'

export const uploadFailed: EnqueueSnackbar = {
  message: 'Error al subir archivo',
  options: { variant: 'error' },
}

export const getFileFailed: EnqueueSnackbar = {
  message: 'Error al obtener archivo',
  options: { variant: 'error' },
}

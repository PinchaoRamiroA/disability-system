import { CloseSnackbarOptions, IEnqueueSnackbar } from '@/types/notistack'
import { createAction } from '@reduxjs/toolkit'

export const enqueueSnackbar = createAction<IEnqueueSnackbar>(
  'notistack/enqueueSnackbar'
)
export const closeSnackbar = createAction<CloseSnackbarOptions>(
  'notistack/closeSnackbar'
)
export const removeSnackbar = createAction<string>('notistack/removeSnackbar')

import { AxiosError } from 'axios'
import { forbiddenError, serverError } from '@/utils/constants/snackbars'
import { EnqueueSnackbar, IEnqueueSnackbar } from '@/types/notistack'
import { nanoid } from '@reduxjs/toolkit'

export const setEnqueueSnackbar = (
	enqueueSnackbar: EnqueueSnackbar,
	err: AxiosError,
	ignore401 = false
): EnqueueSnackbar => {
	if (err.response) {
		if (err.response.status >= 500) {
			return serverError
		} else if (err.response.status === 401 && !ignore401) {
			return {}
		} else if (err.response.status === 403) {
			return forbiddenError
		} else if (err.response.status === 409) {
			return {
				...enqueueSnackbar,
				message: err.response.data,
			}
		}
	}
	return enqueueSnackbar
}

export const addSnackbarKey = (
	enqueueSnackbar: EnqueueSnackbar
): IEnqueueSnackbar => {
	return { ...enqueueSnackbar, key: nanoid() }
}

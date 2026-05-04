import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/uploadFile'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/files'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

interface CallbackProps {
	url: string
	contentType: string
}

interface Params {
	base64: string | ArrayBuffer
	contentType: string
	callback: (data: CallbackProps) => void
}

export const uploadFileAction = createAsyncThunk<
	CallbackProps,
	Params,
	{ rejectValue: EnqueueSnackbar }
>('chats/uploadFile', async (params, { rejectWithValue }) => {
	try {
		const data = await api.uploadFile(params.base64, params.contentType)
		params.callback(data)
		return data
	} catch (err) {
		detectUnauthorized(err, uploadFileAction(params))
		return rejectWithValue(setEnqueueSnackbar(snackbars.uploadFailed, err))
	}
})

export const getFileAction = createAsyncThunk<
	string,
	{
		url: string
		successCallback?: (response: string) => void
		failedCallback?: (message: string) => void
	},
	{ rejectValue: EnqueueSnackbar }
>('chats/getFile', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getFile(params.url)

		params.successCallback?.(data)
		return data
	} catch (err) {
		const error401 = detectUnauthorized(err, getFileAction(params))

		if (!error401) {
			params.failedCallback?.(
				snackbars.getFileFailed.message ?? 'Error al obtener archivo'
			)
		}
		return rejectWithValue(setEnqueueSnackbar(snackbars.getFileFailed, err))
	}
})

import * as api from '@/services/api/reports/humanAgent'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import {
	AccessCSVParams,
	AccessGetParams,
	AccessLogs,
} from '@/types/reports/humanAgent/Access'
import {
	getAccessError,
	getAccessDownloadError,
} from '@/utils/constants/snackbars/reports'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import fileDownload from 'js-file-download'

interface Params {
	idOrg: number
	filters: AccessGetParams
}

export const getAccessLog = createAsyncThunk<
	AccessLogs,
	Params,
	{ rejectValue: EnqueueSnackbar }
>('accessLog', async (params, { rejectWithValue }) => {
	try {
		const data: AccessLogs = await api.getAccessLog(
			params.idOrg,
			params.filters
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getAccessLog(params))
		return rejectWithValue(setEnqueueSnackbar(getAccessError, err))
	}
})

export const getCsvFile = createAsyncThunk<
	string,
	AccessCSVParams,
	{ rejectValue: EnqueueSnackbar }
>('accessLog-download', async (params, { rejectWithValue }) => {
	try {
		const data: string = await api.getAccessCsvFile(params)
		fileDownload(data, 'usuarios.csv')
		return data
	} catch (err) {
		detectUnauthorized(err, getCsvFile(params))
		return rejectWithValue(setEnqueueSnackbar(getAccessDownloadError, err))
	}
})

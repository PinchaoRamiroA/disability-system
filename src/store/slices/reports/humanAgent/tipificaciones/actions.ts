import * as api from '@/services/api/causales'
import * as snackbars from '@/utils/constants/snackbars/causales'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
	CSVReporteCausalesParams,
	ReporteCausalesDataRaw,
	ReporteCausalesParams,
} from '@/types/Causales'
import fileDownload from 'js-file-download'

// Listado de causales
export const getReporteCausales = createAsyncThunk<
	ReporteCausalesDataRaw,
	ReporteCausalesParams,
	{ rejectValue: EnqueueSnackbar }
>('causales-reporte', async (params, { rejectWithValue }) => {
	try {
		const data = await api.reporteCausales(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getReporteCausales(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.reporteCausalError, err)
		)
	}
})

// Descarga de histórico
export const getCSVReporteCausales = createAsyncThunk<
	string,
	CSVReporteCausalesParams,
	{ rejectValue: EnqueueSnackbar }
>('causales/reporte-csv', async (params, { rejectWithValue }) => {
	try {
		const data: string = await api.CSVReporteCausales(params)
		fileDownload(data, 'reporteCausales.csv')
		return data
	} catch (err) {
		detectUnauthorized(err, getCSVReporteCausales(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.reporteCausalError, err)
		)
	}
})

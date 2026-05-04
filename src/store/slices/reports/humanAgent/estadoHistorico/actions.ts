import * as api from '@/services/api/reports/humanAgent'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { getEstadoHistoricoError } from '@/utils/constants/snackbars/humanAgent'
import {
	EstadoHistorico,
	EstadoHistoricoParams,
} from '@/types/HumanAgent/EstadoAsesores'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { getHistoryDownloadError } from '@/utils/constants/snackbars/reports'
import fileDownload from 'js-file-download'

// Chats en general
export const getEstadoHistorico = createAsyncThunk<
	EstadoHistorico,
	EstadoHistoricoParams,
	{ rejectValue: EnqueueSnackbar }
>(
	'humanAgents/reports/estadoHistorico',
	async (params, { rejectWithValue }) => {
		try {
			const data = await api.getEstadoHistorico(params)
			return data
		} catch (err) {
			detectUnauthorized(err, getEstadoHistorico(params))
			return rejectWithValue(
				setEnqueueSnackbar(getEstadoHistoricoError, err)
			)
		}
	}
)

// Descarga de histórico
export const getDescargaHistorico = createAsyncThunk<
	string,
	EstadoHistoricoParams,
	{ rejectValue: EnqueueSnackbar }
>(
	'humanAgents/reports/estadoHistorico/descarga',
	async (params, { rejectWithValue }) => {
		try {
			const data: string = await api.getDescargaHistorico(params)
			fileDownload(data, `historico_${params.start}_${params.end}.csv`)
			return data
		} catch (err) {
			detectUnauthorized(err, getDescargaHistorico(params))
			return rejectWithValue(
				setEnqueueSnackbar(getHistoryDownloadError, err)
			)
		}
	}
)

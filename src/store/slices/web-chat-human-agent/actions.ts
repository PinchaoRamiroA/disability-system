import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/webChatHumanAgent'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/humanAgent'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { Splits } from '@/types/Splits'
import { LogSocket } from '@/types/HumanAgent/WebChat'

// Splits disponibles para transferencia
export const getAvailableTransferSplits = createAsyncThunk<
	Splits[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('splits-transferencia', async (_, { rejectWithValue }) => {
	try {
		const data = await api.getAvailableTransferSplitsAPI()
		return data
	} catch (err) {
		detectUnauthorized(err, getAvailableTransferSplits())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getSplitsTransferenciaError, err)
		)
	}
})

// Agregar log de asesor humano
export const saveLog = createAsyncThunk<
	void,
	LogSocket,
	{ rejectValue: EnqueueSnackbar }
>('logs-asesor-humano', async (params) => {
	try {
		await api.saveLogAPI({
			...params,
			payload: {
				...params.payload,
				application: params.payload.application ?? 'Asesor Humano',
			},
		})
		return
	} catch (err) {
		detectUnauthorized(err, saveLog(params))
		return
	}
})

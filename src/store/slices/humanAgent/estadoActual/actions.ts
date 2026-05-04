import * as api from '@/services/api/humanAgent'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { getEstadoError } from '@/utils/constants/snackbars/humanAgent'
import { EstadoActual } from '@/types/HumanAgent/EstadoAsesores'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { IdOrgParam } from '@/types/auth'

// Chats en general
export const getEstadoActual = createAsyncThunk<
	EstadoActual[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('humanAgents/stats/estadoActual', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getEstadoActual(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getEstadoActual(params))
		return rejectWithValue(setEnqueueSnackbar(getEstadoError, err))
	}
})

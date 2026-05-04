import * as api from '@/services/api/causales-paso-automatico'
import * as snackbars from '@/utils/constants/snackbars/causales'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
	EstadisticaCausales,
	CausalesStatsParams,
	CausalPasoAutomatico,
} from '@/types/Causales'
import { IdOrgParam } from '@/types/auth'

// Listado de causales
export const getCausalesPasoAutomatico = createAsyncThunk<
	CausalPasoAutomatico[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('causales/paso-automatico', async (params, { rejectWithValue }) => {
	try {
		const data = await api.causalesPasoAutomatico(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getCausalesPasoAutomatico(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCausalesError, err)
		)
	}
})

/**
 * Estadística
 */
export const getEstadisticaPasoAutomatico = createAsyncThunk<
	EstadisticaCausales,
	CausalesStatsParams,
	{ rejectValue: EnqueueSnackbar }
>(
	'causales/paso-automatico/estadistica',
	async (params, { rejectWithValue }) => {
		try {
			const data = await api.estadisticaPasoAutomatico(params)

			return data
		} catch (err) {
			detectUnauthorized(err, getEstadisticaPasoAutomatico(params))
			return rejectWithValue(
				setEnqueueSnackbar(
					snackbars.estadisticaPasoAutomaticoError,
					err
				)
			)
		}
	}
)

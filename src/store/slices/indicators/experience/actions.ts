import {
	ExpIndicatorId,
	ExperienceIndicator,
	ExperienceFilters,
} from '@/types/Indicators'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/indicators/indicators'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { EnqueueSnackbar } from '@/types/notistack'
import * as snackbars from '@/utils/constants/snackbars/indicator'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { castResponse, isNumber } from '@/utils/helpers/castIndicatorResponse'

// Nivel de satisfacción
export const getNS = createAsyncThunk<
	ExperienceIndicator,
	ExperienceFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'experience-indicators/NS',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getNS(filters)

			const value = isNumber(data) ? castResponse(data) + ' %' : data
			return { id: 'NS', value }
		} catch (err) {
			detectUnauthorized(err, getNS(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getNSError, err)
			)
		}
	},
	{ idGenerator: () => 'NS' as ExpIndicatorId }
)

// Recurrencia de usuarios
export const getRU = createAsyncThunk<
	ExperienceIndicator,
	ExperienceFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'experience-indicators/Recurrencia',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getRU(filters)

			const value = castResponse(data)
			return { id: 'RU', value }
		} catch (err) {
			detectUnauthorized(err, getRU(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getRUError, err)
			)
		}
	},
	{ idGenerator: () => 'RU' as ExpIndicatorId }
)

// Recurrencia de usuarios
export const getNPS = createAsyncThunk<
	ExperienceIndicator,
	ExperienceFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'experience-indicators/NPS',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getNPS(filters)

			const value = isNumber(data) ? castResponse(data) : data
			return { id: 'NPS', value }
		} catch (err) {
			detectUnauthorized(err, getNPS(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getNPSError, err)
			)
		}
	},
	{ idGenerator: () => 'NPS' as ExpIndicatorId }
)

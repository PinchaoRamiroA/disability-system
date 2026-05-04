import {
	TMOFilters,
	AttentionIndicator,
	AttentionFilters,
	DatesChannelsAndVA,
	DatesAndIdVaParams,
} from '@/types/Indicators'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/indicators/indicators'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { EnqueueSnackbar } from '@/types/notistack'
import * as snackbars from '@/utils/constants/snackbars/indicator'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { castResponse, isNumber } from '@/utils/helpers/castIndicatorResponse'

export const getFCR = createAsyncThunk<
	AttentionIndicator,
	TMOFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getFCR',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getFCR(filters)

			const value = castResponse(data) + ' %'
			return { id: 'FCR', value }
		} catch (err) {
			detectUnauthorized(err, getFCR(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getFCRError, err)
			)
		}
	},
	{ idGenerator: () => 'FCR' }
)

export const getTMAsignacion = createAsyncThunk<
	AttentionIndicator,
	TMOFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getTMAsignacion',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getTMAsignacion(filters)

			const value = castResponse(data, true)
			return { id: 'TMAsignacion', value }
		} catch (err) {
			detectUnauthorized(err, getTMAsignacion(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getTMAsignacionError, err)
			)
		}
	},
	{ idGenerator: () => 'TMAsignacion' }
)

export const getTMAtencionAH = createAsyncThunk<
	AttentionIndicator,
	TMOFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getTMAtencionAH',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getTMAtencionAH(filters)

			const value = castResponse(data, true)
			return { id: 'TMAtencionAH', value }
		} catch (err) {
			detectUnauthorized(err, getTMAtencionAH(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getTMAtencionAHError, err)
			)
		}
	},
	{ idGenerator: () => 'TMAtencionAH' }
)

export const getTMAtencionAV = createAsyncThunk<
	AttentionIndicator,
	TMOFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getTMAtencionAV',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getTMAtencionAV(filters)

			const value = castResponse(data, true)
			return { id: 'TMAtencionAV', value }
		} catch (err) {
			detectUnauthorized(err, getTMAtencionAV(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getTMAtencionAVError, err)
			)
		}
	},
	{ idGenerator: () => 'TMAtencionAV' }
)

export const getTMO = createAsyncThunk<
	AttentionIndicator,
	TMOFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getTMO',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getTMO(filters)

			const value = castResponse(data, true)
			return { id: 'TMO', value }
		} catch (err) {
			detectUnauthorized(err, getTMO(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getTMOError, err)
			)
		}
	},
	{ idGenerator: () => 'TMO' }
)

export const getAttendedChats = createAsyncThunk<
	AttentionIndicator,
	AttentionFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getAttendedChats',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getAttendedChats(filters)

			const value = isNumber(data)
				? castResponse(Number(data)) + ' %'
				: data

			return { id: 'AttendedChats', value }
		} catch (err) {
			detectUnauthorized(err, getAttendedChats(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getTMOError, err)
			)
		}
	},
	{ idGenerator: () => 'AttendedChats' }
)

export const getFaltaRespuestaBot = createAsyncThunk<
	AttentionIndicator,
	DatesAndIdVaParams,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getFaltaRespuestaBot',
	async (params, { rejectWithValue }) => {
		try {
			const data = await api.getFaltaRespuestaBotApi(params)

			const value = isNumber(data)
				? castResponse(Number(data)) + ' %'
				: data

			return { id: 'NivelRespuestaBOT', value }
		} catch (err) {
			detectUnauthorized(err, getFaltaRespuestaBot(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getFaltaRespuestaBotError, err)
			)
		}
	},
	{ idGenerator: () => 'NivelRespuestaBOT' }
)

export const getNivelAbandono = createAsyncThunk<
	AttentionIndicator,
	DatesChannelsAndVA,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getNivelAbandono',
	async (params, { rejectWithValue }) => {
		try {
			const data = await api.getNivelAbandonoApi(params)

			const value = isNumber(data)
				? castResponse(Number(data)) + ' %'
				: data

			return { id: 'NivelAbandono', value }
		} catch (err) {
			detectUnauthorized(err, getNivelAbandono(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getNivelAbandonoError, err)
			)
		}
	},
	{ idGenerator: () => 'NivelAbandono' }
)

export const getNotAttendedChats = createAsyncThunk<
	AttentionIndicator,
	AttentionFilters,
	{
		rejectValue: EnqueueSnackbar
	}
>(
	'indicators/getNotAttendedChats',
	async (filters, { rejectWithValue }) => {
		try {
			const data = await api.getNotAttendedChats(filters)

			const value = isNumber(data)
				? castResponse(Number(data)) + ' %'
				: data

			return { id: 'NotAttendedChats', value }
		} catch (err) {
			detectUnauthorized(err, getNotAttendedChats(filters))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getTMOError, err)
			)
		}
	},
	{ idGenerator: () => 'NotAttendedChats' }
)

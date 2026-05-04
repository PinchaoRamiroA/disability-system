import * as api from '@/services/api/causales'
import * as snackbars from '@/utils/constants/snackbars/causales'

import { EnqueueSnackbar } from '@/types/notistack'
import {
	detectFeatureOff,
	detectUnauthorized,
} from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '../notistack'
import {
	Causal,
	CausalesStatsParams,
	CreateCausalBody,
	DeleteCausalFinBody,
	EstadisticaCausales,
	GetCausalesActivas,
	SaveCausalFin,
	UpdateCausalBody,
} from '@/types/Causales'
import { IdOrgParam } from '@/types/auth'
import { saveLog } from '../web-chat-human-agent'

// Listado de causales de finalización
export const getCausalesFin = createAsyncThunk<
	Causal[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('causales-fin', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getCausalesFin(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getCausalesFin(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCausalesError, err)
		)
	}
})

// Listado de causales activos
export const getCausalesFinActivas = createAsyncThunk<
	Causal[],
	GetCausalesActivas,
	{ rejectValue: EnqueueSnackbar }
>('causales-fin-activos', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getCausalesFinActivas(params.payload)

		if (data.length == 0) {
			params.callback()
		}
		return data
	} catch (err) {
		if (detectFeatureOff(err)) {
			params.callback()
			return []
		}
		detectUnauthorized(err, getCausalesFinActivas(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCausalesError, err)
		)
	}
})

// Crear causal
export const createCausalFin = createAsyncThunk<
	Causal,
	{ causal: Partial<CreateCausalBody>; handleCloseCreate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('causales-fin/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.createCausalFin(params.causal)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.createCausalFinSuccess))
		)
		params.handleCloseCreate()
		return data
	} catch (err) {
		detectUnauthorized(err, createCausalFin(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createCausalFinError, err)
		)
	}
})

// Actualizar causal
export const updateCausalFin = createAsyncThunk<
	Causal,
	{ causal: Partial<UpdateCausalBody>; handleCloseUpdate?: () => void },
	{ rejectValue: EnqueueSnackbar }
>('causales-fin/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateCausalFin(params.causal)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.updateCausalSuccess)))

		if (params.handleCloseUpdate) {
			params.handleCloseUpdate()
		}
		return data
	} catch (err) {
		detectUnauthorized(err, updateCausalFin(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateCausalError, err)
		)
	}
})

// Eliminar causal
export const deleteCausalFin = createAsyncThunk<
	number,
	DeleteCausalFinBody,
	{ rejectValue: EnqueueSnackbar }
>('causales-fin/delete', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.deleteCausalFin(params)

		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteCausalSuccess))
			)
			return params.codigoCausalFinalizacion
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, deleteCausalFin(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteCausalError, err)
		)
	}
})

/**
 * Asesor humano
 */
// Guardar causal de fin
export const saveCausalesFin = createAsyncThunk<
	string,
	SaveCausalFin,
	{ rejectValue: EnqueueSnackbar }
>(
	'causales-fin-activos/create',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.saveCausalesFin(params)
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.createCausalFinSuccess)
				)
			)
			return data
		} catch (err) {
			detectUnauthorized(err, saveCausalesFin(params))

			const { idOrg, idadviser } = params.logErrorPayload

			dispatch(
				saveLog({
					idOrg,
					payload: {
						callback:
							'/api/causalesFinalizacion/guardarCausalFinalizacionConversacion',
						detail: err.message,
						idadviser,
					},
				})
			)

			return rejectWithValue(
				setEnqueueSnackbar(snackbars.createCausalFinError, err)
			)
		}
	}
)

/**
 * Estadística
 */
export const getEstadisticaCausalesFin = createAsyncThunk<
	EstadisticaCausales,
	CausalesStatsParams,
	{ rejectValue: EnqueueSnackbar }
>('causales-fin/estadistica', async (params, { rejectWithValue }) => {
	try {
		const data = await api.estadisticaCausalesFin(params)

		return data
	} catch (err) {
		detectUnauthorized(err, getEstadisticaCausalesFin(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.estadisticaCausalFinError, err)
		)
	}
})

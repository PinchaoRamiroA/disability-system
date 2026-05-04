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
	CreateCausalBody,
	SaveCausalesNegocio,
	DeleteCausalNegocioBody,
	EstadisticaCausales,
	UpdateCausalBody,
	CausalesStatsParams,
	GetCausalesActivas,
} from '@/types/Causales'
import { IdOrgParam } from '@/types/auth'
import { saveLog } from '../web-chat-human-agent'

// Listado de causales
export const getCausalesNegocio = createAsyncThunk<
	Causal[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('causales', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getCausalesNegocio(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getCausalesNegocio(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCausalesError, err)
		)
	}
})

// Listado de causales activos
export const getCausalesNegocioActivas = createAsyncThunk<
	Causal[],
	GetCausalesActivas,
	{ rejectValue: EnqueueSnackbar }
>('causales-activos', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getCausalesNegocioActivas(params.payload)
		return data
	} catch (err) {
		if (detectFeatureOff(err)) {
			params.callback()
			return []
		}
		detectUnauthorized(err, getCausalesNegocioActivas(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getCausalesError, err)
		)
	}
})

// Crear causal
export const createCausalNegocio = createAsyncThunk<
	Causal,
	{ causal: Partial<CreateCausalBody>; handleCloseCreate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('causales/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.createCausalNegocio(params.causal)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.createCausalSuccess)))

		params.handleCloseCreate()
		return data
	} catch (err) {
		detectUnauthorized(err, createCausalNegocio(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createCausalError, err)
		)
	}
})

// Actualizar causal
export const updateCausalNegocio = createAsyncThunk<
	Causal,
	{ causal: Partial<UpdateCausalBody>; handleCloseUpdate?: () => void },
	{ rejectValue: EnqueueSnackbar }
>('causales/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateCausalNegocio(params.causal)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.updateCausalSuccess)))

		if (params.handleCloseUpdate) {
			params.handleCloseUpdate()
		}
		return data
	} catch (err) {
		detectUnauthorized(err, updateCausalNegocio(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateCausalError, err)
		)
	}
})

// Eliminar causal
export const deleteCausalNegocio = createAsyncThunk<
	number,
	DeleteCausalNegocioBody,
	{ rejectValue: EnqueueSnackbar }
>('causales/delete', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.deleteCausalNegocio(params)

		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteCausalSuccess))
			)
			return params.codigoCausal
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, deleteCausalNegocio(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteCausalError, err)
		)
	}
})

/**
 * Asesor humano
 */

// Guardar causales de negocio
export const saveCausalesNegocio = createAsyncThunk<
	string,
	SaveCausalesNegocio,
	{ rejectValue: EnqueueSnackbar }
>('causales-activos/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.saveCausalesNegocio(params.body)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.createCausalSuccess)))
		params.callback()
		return data
	} catch (err) {
		detectUnauthorized(err, saveCausalesNegocio(params))

		const { idOrg, idadviser } = params.logErrorPayload
		dispatch(
			saveLog({
				idOrg,
				payload: {
					callback: '/api/crearListadoCausalesConversacion',
					detail: err.message,
					idadviser,
				},
			})
		)

		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createCausalError, err)
		)
	}
})

/**
 * Estadística
 */
export const getEstadisticaCausalesNegocio = createAsyncThunk<
	EstadisticaCausales,
	CausalesStatsParams,
	{ rejectValue: EnqueueSnackbar }
>('causales/estadistica', async (params, { rejectWithValue }) => {
	try {
		const data = await api.estadisticaCausalesNegocio(params)

		return data
	} catch (err) {
		detectUnauthorized(err, getEstadisticaCausalesNegocio(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.estadisticaCausalNegocioError, err)
		)
	}
})

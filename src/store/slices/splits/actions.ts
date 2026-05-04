import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/splits'
import { EnqueueSnackbar } from '@/types/notistack'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import { updateSplitsError } from '@/utils/constants/snackbars/settings/asesor-humano/asesores'
import {
	CreateSplitAsesorParams,
	CreateSplitDerive,
	CreateSplitParams,
	CreateSplitSchedule,
	DeleteSplitAsesorParams,
	DeleteSplitDerive,
	DeleteSplitParams,
	DeleteSplitSchedule,
	Derivacion,
	HorarioSplit,
	SplitAsesorParams,
	Splits,
	SplitsAsesor,
	UpdateSplitDerive,
	UpdateSplitParams,
	UpdateSplitSchedule,
} from '@/types/Splits'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { enqueueSnackbar } from '../notistack'

// Todos los splits
export const getSplits = createAsyncThunk<
	Splits[],
	{ idOrg: number },
	{ rejectValue: EnqueueSnackbar }
>('splits', async (params, { rejectWithValue }) => {
	try {
		const data: Splits[] = await api.getSplits(params.idOrg)
		return data
	} catch (err) {
		detectUnauthorized(err, getSplits(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getSplitsError, err)
		)
	}
})

// Crear split
export const createSplit = createAsyncThunk<
	Splits,
	{ split: Partial<CreateSplitParams>; handleCloseCreate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('splits/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.createSplit(params.split)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.createSplit)))

		params.handleCloseCreate()
		return data
	} catch (err) {
		detectUnauthorized(err, createSplit(params))
		if (err.response.status === 409) {
			console.log('error', err)
		}
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createSplitError, err)
		)
	}
})

// Actualizar split
export const updateSplit = createAsyncThunk<
	Splits,
	{ split: Partial<UpdateSplitParams>; handleCloseUpdate?: () => void },
	{ rejectValue: EnqueueSnackbar }
>('splits/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateSplit(params.split)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.updateSplit)))

		params.handleCloseUpdate ? params.handleCloseUpdate() : false
		return data
	} catch (err) {
		detectUnauthorized(err, updateSplit(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateSplitError, err)
		)
	}
})

// Eliminar split
export const deleteSplit = createAsyncThunk<
	number,
	DeleteSplitParams,
	{ rejectValue: EnqueueSnackbar }
>('splits/delete', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.deleteSplit(params)

		if (data) {
			dispatch(enqueueSnackbar(addSnackbarKey(snackbars.deleteSplit)))
			return params.codigoSplit
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, deleteSplit(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteSplitError, err)
		)
	}
})

// Splits del asesor
export const getAgentSplits = createAsyncThunk<
	SplitsAsesor[],
	SplitAsesorParams,
	{ rejectValue: EnqueueSnackbar }
>('agentSplits', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getAgentSplits(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getAgentSplits(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getSplitsError, err)
		)
	}
})

// Crear splits al asesor
export const createAgentSplit = createAsyncThunk<
	SplitsAsesor,
	CreateSplitAsesorParams,
	{ rejectValue: EnqueueSnackbar }
>('createAgentSplit', async (params, { rejectWithValue }) => {
	try {
		const data = await api.createAgentSplit(params)
		return data
	} catch (err) {
		detectUnauthorized(err, createAgentSplit(params))
		return rejectWithValue(setEnqueueSnackbar(updateSplitsError, err))
	}
})

// Eliminar splits del asesor
export const deleteAgentSplit = createAsyncThunk<
	boolean,
	DeleteSplitAsesorParams,
	{ rejectValue: EnqueueSnackbar }
>('deleteAgentSplit', async (params, { rejectWithValue }) => {
	try {
		const data = await api.deleteAgentSplit(params)
		return data
	} catch (err) {
		detectUnauthorized(err, deleteAgentSplit(params))
		return rejectWithValue(setEnqueueSnackbar(updateSplitsError, err))
	}
})

// Crear horario split
export const createSplitSchedule = createAsyncThunk<
	HorarioSplit,
	CreateSplitSchedule,
	{ rejectValue: EnqueueSnackbar }
>('splits/schedule/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.createSplitSchedule(params)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.createSplitSchedule)))
		return data
	} catch (err) {
		detectUnauthorized(err, createSplitSchedule(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createSplitScheduleError, err)
		)
	}
})

// Actualizar horario split
export const updateSplitSchedule = createAsyncThunk<
	UpdateSplitSchedule,
	UpdateSplitSchedule,
	{ rejectValue: EnqueueSnackbar }
>('splits/schedule/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateSplitSchedule(params.horarios)

		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateSplitSchedule))
			)
			return params
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, updateSplitSchedule(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateSplitScheduleError, err)
		)
	}
})

// Eliminar horario split
export const deleteSplitSchedule = createAsyncThunk<
	DeleteSplitSchedule,
	DeleteSplitSchedule,
	{ rejectValue: EnqueueSnackbar }
>('splits/schedule/delete', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.deleteSplitSchedule(params.codigoRegistro)

		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteSplitSchedule))
			)
			return params
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, deleteSplitSchedule(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteSplitScheduleError, err)
		)
	}
})

// Crear derivación
export const createSplitDerive = createAsyncThunk<
	Derivacion,
	CreateSplitDerive,
	{ rejectValue: EnqueueSnackbar }
>('splits/derive/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.createSplitDerive(params)
		dispatch(enqueueSnackbar(addSnackbarKey(snackbars.createSplitDerive)))
		return data
	} catch (err) {
		detectUnauthorized(err, createSplitDerive(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createSplitDeriveError, err)
		)
	}
})

// Actualizar derivación
export const updateSplitDerive = createAsyncThunk<
	UpdateSplitDerive,
	UpdateSplitDerive,
	{ rejectValue: EnqueueSnackbar }
>('splits/derive/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateSplitDerive(params.derivaciones)
		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateSplitDerive))
			)
			return params
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, updateSplitDerive(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateSplitDeriveError, err)
		)
	}
})

// Eliminar derivación
export const deleteSplitDerive = createAsyncThunk<
	DeleteSplitDerive,
	DeleteSplitDerive,
	{ rejectValue: EnqueueSnackbar }
>('splits/derive/delete', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.deleteSplitDerive(params)

		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteSplitDerive))
			)
			return params
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, deleteSplitDerive(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteSplitDeriveError, err)
		)
	}
})

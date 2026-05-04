import * as api from '@/services/api/pauseEvents'
import * as snackbars from '@/utils/constants/snackbars/pauseEvents'

import {
	CreatePauseEvent,
	DeletePauseEvent,
	PauseEvent,
} from '@/types/PauseEvents'
import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '../notistack'

// Listado de eventos de pausa
export const getPauseEvents = createAsyncThunk<
	PauseEvent[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('pauseEvents', async (_, { rejectWithValue }) => {
	try {
		const data = await api.getPauseEvents()
		return data
	} catch (err) {
		detectUnauthorized(err, getPauseEvents())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getPauseEventsError, err)
		)
	}
})

// Crear evento de pausa
export const createPauseEvent = createAsyncThunk<
	PauseEvent,
	{ event: Partial<CreatePauseEvent>; handleCloseCreate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('pauseEvents/create', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.createPauseEvent(params.event)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.createPauseEventSuccess))
		)
		params.handleCloseCreate()
		return data
	} catch (err) {
		detectUnauthorized(err, createPauseEvent(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createPauseEventError, err)
		)
	}
})

// Crear evento de pausa
export const updatePauseEvent = createAsyncThunk<
	PauseEvent,
	{ event: Partial<PauseEvent>; handleCloseUpdate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('pauseEvents/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updatePauseEvent(params.event)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.updatePauseEventSuccess))
		)

		params.handleCloseUpdate()
		return data
	} catch (err) {
		detectUnauthorized(err, updatePauseEvent(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updatePauseEventError, err)
		)
	}
})

// Eliminar evento de pausa
export const deletePauseEvent = createAsyncThunk<
	number,
	DeletePauseEvent,
	{ rejectValue: EnqueueSnackbar }
>('pauseEvents/delete', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.deletePauseEvent(params)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.deletePauseEventSuccess))
		)
		return data
	} catch (err) {
		detectUnauthorized(err, deletePauseEvent(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deletePauseEventError, err)
		)
	}
})

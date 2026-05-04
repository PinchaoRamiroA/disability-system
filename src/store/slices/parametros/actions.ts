import * as api from '@/services/api/parametros'
import * as snackbars from '@/utils/constants/snackbars/settings/numeroChats'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '../notistack'
import { ParametrosGenerales } from '@/types/Settings/General/Parametros'

// Parámetros del asesor humano
export const getParametros = createAsyncThunk<
	ParametrosGenerales,
	void,
	{ rejectValue: EnqueueSnackbar }
>('parametros', async (_, { rejectWithValue }) => {
	try {
		const data = await api.getParametros()
		return data
	} catch (err) {
		detectUnauthorized(err, getParametros())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getParametrosError, err)
		)
	}
})

// Actualizar parámetros
export const updateParametros = createAsyncThunk<
	ParametrosGenerales,
	ParametrosGenerales,
	{ rejectValue: EnqueueSnackbar }
>('parametros/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateParametros(params)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.updateParametrosSuccess))
		)
		return data
	} catch (err) {
		detectUnauthorized(err, updateParametros(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateParametrosError, err)
		)
	}
})

import { enqueueSnackbar } from '@/store/slices/notistack'
import { EnqueueSnackbar } from '@/types/notistack'
import {
	ParametroBloqueo,
	ParametroCaducidad,
	UpdateParametroBloqueo,
	UpdateParametroCaducidad,
} from '@/types/users'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
	getParametrosBloqueoAPI,
	getParametrosCaducidadAPI,
	updateParametrosBloqueoAPI,
	updateParametrosCaducidadAPI,
} from '@/services/api/users'
import * as snackbars from '@/utils/constants/snackbars/user'

export const getParametrosBloqueo = createAsyncThunk<
	ParametroBloqueo[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('parametros-bloqueo', async (_, { rejectWithValue }) => {
	try {
		const data = await getParametrosBloqueoAPI()
		return data
	} catch (err) {
		detectUnauthorized(err, getParametrosBloqueo())

		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getParamBloqueoError, err)
		)
	}
})

export const updateParametrosBloqueo = createAsyncThunk<
	ParametroBloqueo,
	UpdateParametroBloqueo,
	{ rejectValue: EnqueueSnackbar }
>(
	'parametros-bloqueo/update',
	async (params, { dispatch, rejectWithValue }) => {
		try {
			const data = await updateParametrosBloqueoAPI(params)
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.updateParamBloqueoSuccess)
				)
			)
			return data[0]
		} catch (err) {
			detectUnauthorized(err, updateParametrosBloqueo(params))

			return rejectWithValue(
				setEnqueueSnackbar(snackbars.updateParamBloqueoError, err)
			)
		}
	}
)

export const getParametrosCaducidad = createAsyncThunk<
	ParametroCaducidad[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('parametros-caducidad', async (_, { rejectWithValue }) => {
	try {
		const data = await getParametrosCaducidadAPI()
		return data
	} catch (err) {
		detectUnauthorized(err, getParametrosCaducidad())

		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getParamCaducidadError, err)
		)
	}
})

export const updateParametrosCaducidad = createAsyncThunk<
	ParametroCaducidad,
	UpdateParametroCaducidad,
	{ rejectValue: EnqueueSnackbar }
>(
	'parametros-caducidad/update',
	async (params, { dispatch, rejectWithValue }) => {
		try {
			const data = await updateParametrosCaducidadAPI(params)
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.updateParamCaducidadSuccess)
				)
			)
			return data[0]
		} catch (err) {
			detectUnauthorized(err, updateParametrosCaducidad(params))

			return rejectWithValue(
				setEnqueueSnackbar(snackbars.updateParamCaducidadError, err)
			)
		}
	}
)

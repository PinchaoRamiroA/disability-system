import * as api from '@/services/api/settings/asistente-virtual'
import * as snackbars from '@/utils/constants/snackbars/settings/asistente-virtual/expiracion'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
	ExpiracionSesion,
	GetExpiracionSesionParams,
	PostExpiracionSesionParams,
} from '@/types/Settings/asistente-virtual/Expiracion'
import { enqueueSnackbar } from '@/store/slices/notistack'

// Configuración de expiración de sesión
export const getExpiracionConfig = createAsyncThunk<
	ExpiracionSesion[],
	GetExpiracionSesionParams,
	{ rejectValue: EnqueueSnackbar }
>('expiracion-config', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getExpiracionSesionData(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getExpiracionConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getExpiracionError, err)
		)
	}
})

// Actualizar configuración de expiración de sesión
export const updateExpiracionConfig = createAsyncThunk<
	ExpiracionSesion,
	PostExpiracionSesionParams,
	{ rejectValue: EnqueueSnackbar }
>('expiracion-config/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateExpiracionSesion(params)
		dispatch(
			enqueueSnackbar(addSnackbarKey(snackbars.updateExpiracionSuccess))
		)
		return data
	} catch (err) {
		detectUnauthorized(err, updateExpiracionConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateExpiracionError, err)
		)
	}
})

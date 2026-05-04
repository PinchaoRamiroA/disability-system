import * as api from '@/services/api/settings/asistente-virtual/formulario-entrada'
import * as snackbars from '@/utils/constants/snackbars/settings/asistente-virtual/formulario-entrada'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
	FormEntrada,
	UpdateFormEntrada,
} from '@/types/Settings/asistente-virtual/FormularioEntrada'
import { OrgAndIdva } from '@/types/OrgAndIdva'

// Llama servicio que obtiene configuración del formulario de entrada del widget
export const getFormEntrada = createAsyncThunk<
	FormEntrada[],
	OrgAndIdva,
	{ rejectValue: EnqueueSnackbar }
>('formulario-entrada', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getFormEntradaApi(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getFormEntrada(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getFormEntradaError, err)
		)
	}
})

// Llama servicio que actualiza la configuración de un campo del formulario de entrada del widget
export const updateFormEntradaField = createAsyncThunk<
	FormEntrada[],
	UpdateFormEntrada,
	{ rejectValue: EnqueueSnackbar }
>('formulario-entrada/update', async (params, { rejectWithValue }) => {
	try {
		const data = await api.updateFormEntradaFieldApi(params)
		return data
	} catch (err) {
		detectUnauthorized(err, updateFormEntradaField(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateFormFieldError, err)
		)
	}
})

// Servicio para reordenar campos
export const sortFormEntrada = createAsyncThunk<
	FormEntrada[],
	UpdateFormEntrada,
	{ rejectValue: EnqueueSnackbar }
>('formulario-entrada/sort', async (params, { rejectWithValue }) => {
	try {
		const data = await api.sortFormEntradaFieldApi(params)
		return data
	} catch (err) {
		detectUnauthorized(err, sortFormEntrada(params))
		return rejectWithValue(setEnqueueSnackbar(snackbars.sortFormError, err))
	}
})

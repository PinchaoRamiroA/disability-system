import * as api from '@/services/api/settings/personalizacion/funcionalidades'
import * as snackbars from '@/utils/constants/snackbars/settings/personalizacion/funcionalidades'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { OrgAndIdva } from '@/types/OrgAndIdva'
import {
	ConfigFeature,
	ConfigFeatureUpdate,
} from '@/types/Settings/personalizacion/funcionalidades'

// Llama servicio que obtiene configuración del formulario de entrada del widget
export const getFeaturesConfig = createAsyncThunk<
	ConfigFeature[],
	OrgAndIdva,
	{ rejectValue: EnqueueSnackbar }
>('features', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getFeaturesConfig(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getFeaturesConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getFeaturesError, err)
		)
	}
})

// Llama servicio que actualiza la configuración de un campo del formulario de entrada del widget
export const updateFeatureConfig = createAsyncThunk<
	ConfigFeature,
	ConfigFeatureUpdate,
	{ rejectValue: EnqueueSnackbar }
>('features/update', async (params, { rejectWithValue }) => {
	try {
		const data = await api.updateFeatureConfig(params)
		return data
	} catch (err) {
		detectUnauthorized(err, updateFeatureConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateFeatureError, err)
		)
	}
})

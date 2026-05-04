import * as api from '@/services/api/settings/asesor-humano/plantillas-respuesta'
import * as snackbars from '@/utils/constants/snackbars/settings/asesor-humano/plantillasSnackbar'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '@/store/slices/notistack'
import {
	DeletePlantillaRespuesta,
	NormalizedPlantillaRespuesta,
	PlantillaRespuesta,
	UpsertPlantillaRespuesta,
} from '@/types/Settings/asesor-humano/plantillas-respuesta'

// Obtener plantillas
export const getPlantillasRespuesta = createAsyncThunk<
	NormalizedPlantillaRespuesta[],
	{ idOrg: number },
	{ rejectValue: EnqueueSnackbar }
>('plantillas-respuesta/get', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getPlantillasRespuestaApi(params.idOrg)

		return data.templates.map((template) => ({
			...template,
			id: nanoid(),
		}))
	} catch (err) {
		detectUnauthorized(err, getPlantillasRespuesta(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getPlantillasError, err)
		)
	}
})

// Crear plantilla de respuesta
export const createPlantillaRespuesta = createAsyncThunk<
	PlantillaRespuesta,
	UpsertPlantillaRespuesta,
	{ rejectValue: EnqueueSnackbar }
>(
	'plantillas-respuesta/create',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.upsertPlantillaRespuestaApi(params)
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.createPlantillaSuccess)
				)
			)
			params.handleClose()
			return data
		} catch (err) {
			detectUnauthorized(err, createPlantillaRespuesta(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.createPlantillaError, err)
			)
		}
	}
)

// Actualizar plantilla de respuesta
export const updatePlantillaRespuesta = createAsyncThunk<
	PlantillaRespuesta,
	UpsertPlantillaRespuesta,
	{ rejectValue: EnqueueSnackbar }
>(
	'plantillas-respuesta/update',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.upsertPlantillaRespuestaApi(params)
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.updatePlantillaSuccess)
				)
			)
			params.handleClose()
			return data
		} catch (err) {
			detectUnauthorized(err, updatePlantillaRespuesta(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.updatePlantillaError, err)
			)
		}
	}
)

// Eliminar plantilla de respuesta
export const deletePlantillaRespuesta = createAsyncThunk<
	number,
	DeletePlantillaRespuesta,
	{ rejectValue: EnqueueSnackbar }
>(
	'plantillas-respuesta/delete',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			await api.deletePlantillaRespuestaApi(params)
			dispatch(
				enqueueSnackbar(
					addSnackbarKey(snackbars.deletePlantillaSuccess)
				)
			)
			// Retornar id de la plantilla para eliminar el slice
			params.handleClose()
			return params.payload.idTemplate
		} catch (err) {
			detectUnauthorized(err, deletePlantillaRespuesta(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.deletePlantillaError, err)
			)
		}
	}
)

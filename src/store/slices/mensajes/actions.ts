import * as api from '@/services/api/mensajes'
import * as snackbars from '@/utils/constants/snackbars/settings/mensajes'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '../notistack'

import { MensajesConfig } from '@/types/Settings/Mensajes'
import { CUSTOM_MESSAGES } from '@/utils/constants/localStorageConstants'

// Mensajes de configuración activos
export const getMensajesConfig = createAsyncThunk<
	MensajesConfig[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('configuracion-mensajes/activos', async (_, { rejectWithValue }) => {
	try {
		const data = await api.getMensajesConfig()
		return data
	} catch (err) {
		detectUnauthorized(err, getMensajesConfig())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getMensajesError, err)
		)
	}
})

// Actualizar mensaje de configuración
export const updateMensajeConfig = createAsyncThunk<
	MensajesConfig,
	MensajesConfig,
	{ rejectValue: EnqueueSnackbar }
>(
	'configuracion-mensajes/update',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.updateMensajeConfig(params)
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateMensajeSuccess))
			)
			return data
		} catch (err) {
			detectUnauthorized(err, updateMensajeConfig(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.updateMensajeError, err)
			)
		}
	}
)

type Callback = undefined | (() => void)
// Listado de mensajes configurados
export const getFullConfigMensajes = createAsyncThunk<
	MensajesConfig[],
	Callback,
	{ rejectValue: EnqueueSnackbar }
>('configuracion-mensajes/list', async (callback, { rejectWithValue }) => {
	try {
		const data = await api.getFullConfigMensajes()

		// Actualizar mensajes en localStorage
		if (
			localStorage.getItem(CUSTOM_MESSAGES)?.toString() !==
			JSON.stringify(data)
		) {
			localStorage.setItem(CUSTOM_MESSAGES, JSON.stringify(data))
		}

		if (callback) {
			callback()
		}

		return data
	} catch (err) {
		detectUnauthorized(err, getFullConfigMensajes(callback))

		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getMensajesError, err)
		)
	}
})

import * as api from '@/services/api/widgetConfig'
import * as snackbars from '@/utils/constants/snackbars/settings/widgetCustomization'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '../notistack'
import {
	AvatarType,
	GetWidgetAvatar,
	GetWidgetConfig,
	UpdateWidgetAvatar,
	UpdateWidgetConfig,
	WidgetConfig,
} from '@/types/Settings/General/Widget'
import { WIDGET_CONFIG_DEFAULT } from '@/utils/constants/widgetConfigDefault'

// Obtener configuración actual del widget
export const getWidgetConfig = createAsyncThunk<
	WidgetConfig,
	GetWidgetConfig,
	{ rejectValue: EnqueueSnackbar }
>('widget-config', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getWidgetConfig(params)

		if (data) {
			return {
				colores: JSON.parse(data.Colores),
				font: JSON.parse(data.font),
			}
		}

		return WIDGET_CONFIG_DEFAULT
	} catch (err) {
		detectUnauthorized(err, getWidgetConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getConfigError, err)
		)
	}
})

// Actualizar configuración del widget
export const updateWidgetConfig = createAsyncThunk<
	WidgetConfig,
	UpdateWidgetConfig,
	{ rejectValue: EnqueueSnackbar }
>('widget-config/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateWidgetConfig(params)

		if (data) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateConfigSuccess))
			)
			return {
				colores: JSON.parse(data.Colores),
				font: JSON.parse(data.font),
			}
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, updateWidgetConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateConfigError, err)
		)
	}
})

/**
 * Avatar
 */
// Obtener url del avatar actual del widget
export const getWidgetAvatar = createAsyncThunk<
	AvatarType,
	GetWidgetAvatar,
	{ rejectValue: EnqueueSnackbar }
>('widget-avatar', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getWidgetAvatar(params)

		if (data.length) {
			return {
				file: null,
				url: data,
			}
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, getWidgetAvatar(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getAvatarError, err)
		)
	}
})

// Actualizar avatar del widget
export const updateWidgetAvatar = createAsyncThunk<
	AvatarType,
	UpdateWidgetAvatar,
	{ rejectValue: EnqueueSnackbar }
>('widget-avatar/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateWidgetAvatar(params)

		if (data.Imagen) {
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateAvatarSuccess))
			)
			return {
				file: null,
				url: data.Imagen,
			}
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, updateWidgetAvatar(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateAvatarError, err)
		)
	}
})

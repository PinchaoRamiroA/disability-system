import * as api from '@/services/api/dashboardConfig'
import * as snackbars from '@/utils/constants/snackbars/settings/dashboardCustomization'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '../notistack'
import {
	LogoType,
	GetDashboardConfig,
	UpdateDashboardLogo,
	UpdateDashboardConfig,
	DashboardConfig,
} from '@/types/Settings/General/Dashboard'
import {
	DASHBOARD_DEFAULT_CONFIG,
	DASHBOARD_IMAGE_LS,
	DASHBOARD_STYLES_LS,
} from '@/utils/constants/dashboardConfig'

// Obtener configuración actual del dashboard
export const getDashboardConfig = createAsyncThunk<
	DashboardConfig,
	GetDashboardConfig,
	{ rejectValue: EnqueueSnackbar }
>('dashboard-config', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getDashboardConfig(params)

		if (data) {
			// Actualizar estilos en localStorage
			if (
				localStorage.getItem(DASHBOARD_STYLES_LS)?.toString() !==
				JSON.stringify(data)
			) {
				localStorage.setItem(DASHBOARD_STYLES_LS, JSON.stringify(data))
			}
			return data
		}

		return DASHBOARD_DEFAULT_CONFIG
	} catch (err) {
		detectUnauthorized(err, getDashboardConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getConfigError, err)
		)
	}
})

// Actualizar configuración del dashboard
export const updateDashboardConfig = createAsyncThunk<
	DashboardConfig,
	UpdateDashboardConfig,
	{ rejectValue: EnqueueSnackbar }
>('dashboard-config/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateDashboardConfig(params)

		if (data) {
			// Muestra snackbar
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateConfigSuccess))
			)
			// Actualizar estilos en localStorage
			if (
				localStorage.getItem(DASHBOARD_STYLES_LS)?.toString() !==
				JSON.stringify(data)
			) {
				localStorage.setItem(DASHBOARD_STYLES_LS, JSON.stringify(data))
			}
			return data
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, updateDashboardConfig(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateConfigError, err)
		)
	}
})

/**
 * Logo
 */
// Obtener url del logo actual del dashboard
export const getDashboardLogo = createAsyncThunk<
	LogoType,
	GetDashboardConfig,
	{ rejectValue: EnqueueSnackbar }
>('dashboard-logo', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getDashboardLogo(params)

		if (data.length) {
			// Actualizar referencia de imagen en localStorage
			if (localStorage.getItem(DASHBOARD_IMAGE_LS)?.toString() !== data) {
				localStorage.setItem(DASHBOARD_IMAGE_LS, data)
			}
			return {
				file: null,
				url: data,
			}
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, getDashboardLogo(params))
		return rejectWithValue(setEnqueueSnackbar(snackbars.getLogoError, err))
	}
})

// Actualizar logo del dashboard
export const updateDashboardLogo = createAsyncThunk<
	LogoType,
	UpdateDashboardLogo,
	{ rejectValue: EnqueueSnackbar }
>('dashboard-logo/update', async (params, { rejectWithValue, dispatch }) => {
	try {
		const data = await api.updateDashboardLogo(params)

		if (data.Imagen) {
			// Actualizar referencia de imagen en localStorage
			if (
				localStorage.getItem(DASHBOARD_IMAGE_LS)?.toString() !==
				data.Imagen
			) {
				localStorage.setItem(DASHBOARD_IMAGE_LS, data.Imagen)
			}
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateLogoSuccess))
			)
			return {
				file: null,
				url: data.Imagen,
			}
		}
		throw new Error('')
	} catch (err) {
		detectUnauthorized(err, updateDashboardLogo(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateLogoError, err)
		)
	}
})

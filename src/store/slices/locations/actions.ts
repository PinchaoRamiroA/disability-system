import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/locations'
import {
	CreateRegionalParams,
	DeleteRegionalParams,
	Department,
	Locations,
	Region,
	UpdateDepartmentParams,
	UpdateRegionalParams,
	UrlParams,
} from '@/types/Locations'
import { EnqueueSnackbar } from '@/types/notistack'
import * as snackbars from '@/utils/constants/snackbars/settings/regionals'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

// Obtener regionales, departamentos y ciudades
export const getLocations = createAsyncThunk<
	Locations,
	UrlParams,
	{ rejectValue: EnqueueSnackbar }
>('locations/getLocations', async (params, { rejectWithValue }) => {
	try {
		const data: Locations = await api.getLocations(
			params.idOrg,
			params.requireCities
		)

		return data
	} catch (err) {
		detectUnauthorized(err, getLocations(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getLocationsError, err)
		)
	}
})

// Crear nueva regional
export const createRegional = createAsyncThunk<
	Region,
	CreateRegionalParams,
	{ rejectValue: EnqueueSnackbar }
>('locations/createRegional', async (params, { rejectWithValue }) => {
	try {
		const data = await api.createRegional(params)

		return data
	} catch (err) {
		detectUnauthorized(err, createRegional(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createRegionalsError, err)
		)
	}
})

// Actualizar regional
export const updateRegional = createAsyncThunk<
	Region,
	UpdateRegionalParams,
	{ rejectValue: EnqueueSnackbar }
>('locations/updateRegional', async (params, { rejectWithValue }) => {
	try {
		const data = await api.updateRegional(params)

		return data
	} catch (err) {
		detectUnauthorized(err, updateRegional(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateRegionalsError, err)
		)
	}
})

// Eliminar regional
export const deleteRegional = createAsyncThunk<
	boolean,
	DeleteRegionalParams,
	{ rejectValue: EnqueueSnackbar }
>('locations/deleteRegional', async (params, { rejectWithValue }) => {
	try {
		const data = await api.deleteRegional(params)

		return data
	} catch (err) {
		detectUnauthorized(err, deleteRegional(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteRegionalsError, err)
		)
	}
})

// Actualizar departamento (cambiar de regional)
export const updateDepartment = createAsyncThunk<
	Department,
	UpdateDepartmentParams,
	{ rejectValue: EnqueueSnackbar }
>('locations/updateDepartment', async (params, { rejectWithValue }) => {
	try {
		const data = await api.updateDepartment(params)

		return data
	} catch (err) {
		detectUnauthorized(err, updateDepartment(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateDepartmentError, err)
		)
	}
})

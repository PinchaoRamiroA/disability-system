import * as api from '@/services/api/settings/asesor-humano/directorio-contactos'
import * as snackbars from '@/utils/constants/snackbars/settings/asesor-humano/directorioSnackbar'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { enqueueSnackbar } from '@/store/slices/notistack'
import {
	CreateContact,
	DeleteContact,
	RawContact,
	UpdateContact,
} from '@/types/Settings/asesor-humano/directorio'
import { IdVaAndOrOrg } from '@/types/OrgAndIdva'

// Obtener todos los contactos
export const getContacts = createAsyncThunk<
	RawContact[],
	IdVaAndOrOrg,
	{ rejectValue: EnqueueSnackbar }
>('directorio-contactos', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getContactsApi(params)

		return data
	} catch (err) {
		detectUnauthorized(err, getContacts(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getContactsError, err)
		)
	}
})

// Obtener solo contactos activos
export const getActiveContacts = createAsyncThunk<
	RawContact[],
	{ idVa?: number; snackbar?: boolean },
	{ rejectValue: EnqueueSnackbar }
>(
	'directorio-contactos/actives',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.getActiveContactsApi(params.idVa)

			if (params.snackbar && data.length === 0) {
				dispatch(
					enqueueSnackbar(
						addSnackbarKey({
							dismissed: true,
							message:
								'No hay contactos disponibles para mostrar',
							options: {
								autoHideDuration: 3000,
								variant: 'info',
							},
						})
					)
				)
			}
			return data
		} catch (err) {
			detectUnauthorized(err, getActiveContacts(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.getContactsError, err)
			)
		}
	}
)

// Crear nuevo contacto
export const createContact = createAsyncThunk<
	RawContact,
	CreateContact,
	{ rejectValue: EnqueueSnackbar }
>(
	'directorio-contactos/create',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.createContactApi(params.body)
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.createContactSuccess))
			)
			params.handleCloseCreate()
			return data
		} catch (err) {
			detectUnauthorized(err, createContact(params))

			params.resetSubmitting ? params.resetSubmitting() : false
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.createContactError, err)
			)
		}
	}
)

// Actualizar contacto
export const updateContact = createAsyncThunk<
	RawContact,
	UpdateContact,
	{ rejectValue: EnqueueSnackbar }
>(
	'directorio-contactos/update',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.updateContactApi(params.body)
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateContactSuccess))
			)
			params.handleCloseUpdate ? params.handleCloseUpdate() : false
			return data
		} catch (err) {
			detectUnauthorized(err, updateContact(params))

			params.resetSubmitting ? params.resetSubmitting() : false
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.updateContactError, err)
			)
		}
	}
)

// Eliminar plantilla de respuesta
export const deleteContact = createAsyncThunk<
	number,
	DeleteContact,
	{ rejectValue: EnqueueSnackbar }
>(
	'directorio-contactos/delete',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			await api.deleteContactApi(params)
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.deleteContactSuccess))
			)
			// Retornar id del contacto para eliminar del slice
			return params.idContact
		} catch (err) {
			detectUnauthorized(err, deleteContact(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.deleteContactError, err)
			)
		}
	}
)

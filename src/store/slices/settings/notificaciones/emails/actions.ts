import * as api from '@/services/api/settings/notificaciones/emails'
import * as snackbars from '@/utils/constants/snackbars/settings/notificaciones/emails'

import { EnqueueSnackbar } from '@/types/notistack'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { IdOrgParam } from '@/types/auth'
import {
	EmailsConfig,
	EmailsConfigCreate,
	EmailsConfigDelete,
	EmailsConfigUpdate,
} from '@/types/Notificaciones'

// Obtener emails
export const getEmails = createAsyncThunk<
	EmailsConfig[],
	IdOrgParam,
	{ rejectValue: EnqueueSnackbar }
>('config-notif-emails/get', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getEmailsAPI(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getEmails(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getEmailsError, err)
		)
	}
})

// Crear email
export const createEmail = createAsyncThunk<
	EmailsConfig,
	{ config: EmailsConfigCreate; handleCloseCreate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('config-notif-emails/create', async (params, { rejectWithValue }) => {
	try {
		const data = await api.createEmailAPI(params.config)

		params.handleCloseCreate()
		return data
	} catch (err) {
		detectUnauthorized(err, createEmail(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.createEmailError, err)
		)
	}
})

// Actualizar email
export const updateEmail = createAsyncThunk<
	EmailsConfig,
	{ config: EmailsConfigUpdate; handleCloseUpdate: () => void },
	{ rejectValue: EnqueueSnackbar }
>('config-notif-emails/update', async (params, { rejectWithValue }) => {
	try {
		const data = await api.updateEmailAPI(params.config)

		params.handleCloseUpdate()

		return data
	} catch (err) {
		detectUnauthorized(err, updateEmail(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateEmailError, err)
		)
	}
})

// Eliminar email
export const deleteEmail = createAsyncThunk<
	EmailsConfig,
	{ config: EmailsConfigDelete; handleCloseDelete: () => void },
	{ rejectValue: EnqueueSnackbar }
>('config-notif-emails/delete', async (params, { rejectWithValue }) => {
	try {
		const data = await api.deleteEmailAPI(params.config)

		params.handleCloseDelete()
		return data
	} catch (err) {
		detectUnauthorized(err, deleteEmail(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteEmailError, err)
		)
	}
})

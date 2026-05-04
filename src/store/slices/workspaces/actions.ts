import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/workspaces'
import { EnqueueSnackbar } from '@/types/notistack'
import {
	addSnackbarKey,
	setEnqueueSnackbar,
} from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/settings/workspaces'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import {
	DeleteWorkspaceAnswerPayload,
	UpdateWorkspace,
	UpdateWorkspaceAnswerPayload,
	Workspace,
	WorkspaceAnswer,
	WorkspaceAnswerDetail,
	WorkspaceAnswerDetailPayload,
} from '@/types/Workspaces'
import { enqueueSnackbar } from '../notistack'

// Obtener Workspaces
export const getWorkspaces = createAsyncThunk<
	Workspace[],
	void,
	{ rejectValue: EnqueueSnackbar }
>('settings/workspaces/all', async (_, { rejectWithValue }) => {
	try {
		const data = await api.getWorkspaces()
		return data
	} catch (err) {
		detectUnauthorized(err, getWorkspaces())
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getWorkspacesError, err)
		)
	}
})

// Respuestas de Workspaces
export const getWorkspaceAnswers = createAsyncThunk<
	WorkspaceAnswer[],
	{ workspaceId: number },
	{ rejectValue: EnqueueSnackbar }
>('settings/workspaces/answers', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getWorkspaceAnswers(params.workspaceId)
		return data
	} catch (err) {
		detectUnauthorized(err, getWorkspaceAnswers(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getWorkspaceAnswersError, err)
		)
	}
})

// Actualizar workspace
export const updateWorkspace = createAsyncThunk<
	UpdateWorkspace,
	{ workspaceId: number },
	{ rejectValue: EnqueueSnackbar }
>('settings/workspaces/update', async (params, { rejectWithValue }) => {
	try {
		const data = await api.updateWorkspace(params.workspaceId)
		return data
	} catch (err) {
		detectUnauthorized(err, updateWorkspace(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.updateWorkspaceError, err)
		)
	}
})

// Detalle respuesta de Workspace
export const getWorkspaceAnswerDetail = createAsyncThunk<
	WorkspaceAnswerDetail[],
	WorkspaceAnswerDetailPayload,
	{ rejectValue: EnqueueSnackbar }
>('settings/workspaces/answer-detail', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getWorkspaceAnswerDetail(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getWorkspaceAnswerDetail(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getWorkspaceAnswerDetailsError, err)
		)
	}
})

// Crear respuesta de workspace
export const createWorkspaceAnswer = createAsyncThunk<
	UpdateWorkspaceAnswerPayload[],
	UpdateWorkspaceAnswerPayload[],
	{ rejectValue: EnqueueSnackbar }
>(
	'settings/workspaces/create-answer',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.updateWorkspaceAnswer(params)
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.createWorkspaceAnswer))
			)
			return data
		} catch (err) {
			detectUnauthorized(err, createWorkspaceAnswer(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.createWorkspaceAnswerError, err)
			)
		}
	}
)

// Modificar respuesta de workspace
export const updateWorkspaceAnswer = createAsyncThunk<
	UpdateWorkspaceAnswerPayload[],
	UpdateWorkspaceAnswerPayload[],
	{ rejectValue: EnqueueSnackbar }
>(
	'settings/workspaces/update-answer',
	async (params, { rejectWithValue, dispatch }) => {
		try {
			const data = await api.updateWorkspaceAnswer(params)
			dispatch(
				enqueueSnackbar(addSnackbarKey(snackbars.updateWorkspaceAnswer))
			)
			return data
		} catch (err) {
			detectUnauthorized(err, updateWorkspaceAnswer(params))
			return rejectWithValue(
				setEnqueueSnackbar(snackbars.updateWorkspaceAnswerError, err)
			)
		}
	}
)

// Eliminar respuesta de workspace
export const deleteWorkspaceAnswer = createAsyncThunk<
	DeleteWorkspaceAnswerPayload,
	DeleteWorkspaceAnswerPayload,
	{ rejectValue: EnqueueSnackbar }
>('settings/workspaces/delete-answer', async (params, { rejectWithValue }) => {
	try {
		const data = await api.deleteWorkspaceAnswer(params)
		return data
	} catch (err) {
		detectUnauthorized(err, deleteWorkspaceAnswer(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.deleteWorkspaceError, err)
		)
	}
})

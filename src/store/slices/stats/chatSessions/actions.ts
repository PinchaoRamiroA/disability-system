import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/stats'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import * as snackbars from '@/utils/constants/snackbars/filter'
import {
	ChatSessions,
	ConversacionesCanalParams,
} from '@/types/Statistics/ChatSessions'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'
import { castResponse } from '@/utils/helpers/castIndicatorResponse'

export const getChatSessionsConversations = createAsyncThunk<
	ChatSessions,
	ConversacionesCanalParams,
	{ rejectValue: EnqueueSnackbar }
>('chatSessions/conversations', async (params, { rejectWithValue }) => {
	try {
		const data: ChatSessions = await api.getChatSessionsConversations(
			params
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getChatSessionsConversations(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getChatConversationsError, err)
		)
	}
})

export const getChatSessionsInteractions = createAsyncThunk<
	number,
	ConversacionesCanalParams,
	{ rejectValue: EnqueueSnackbar }
>('chatSessions/interactions', async (params, { rejectWithValue }) => {
	try {
		const data: number = await api.getChatSessionsInteractions(params)
		return data
	} catch (err) {
		detectUnauthorized(err, getChatSessionsInteractions(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getChatConversationsError, err)
		)
	}
})

// Tiempo promedio por conversación
export const getInteractionsAVG = createAsyncThunk<
	number,
	ConversacionesCanalParams,
	{ rejectValue: EnqueueSnackbar }
>('chatSessions/avgtime', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getInteractionsAVG(params)
		return Number(castResponse(data))
	} catch (err) {
		detectUnauthorized(err, getInteractionsAVG(params))
		return rejectWithValue(
			setEnqueueSnackbar(snackbars.getInteractionsAVGError, err)
		)
	}
})

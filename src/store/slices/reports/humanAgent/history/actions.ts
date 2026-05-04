import { EnqueueSnackbar } from '@/types/notistack'
import {
	InteractionHistory,
	History,
	HistoryGetParams,
	AgentGetChatsParams,
	AttentionInteractionsList,
	MaxEntriesParams,
} from '@/types/reports/humanAgent/History'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'

import * as api from '@/services/api/reports/humanAgent'
import {
	getChatsError,
	getHistoryError,
	getInteractionHistoryError,
} from '@/utils/constants/snackbars/reports'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

interface Params {
	idOrg: number
	filters: HistoryGetParams
}

interface InteractionHistoryParams {
	idOrg: number
	conversationId: number
}

interface AgentChatParams {
	idOrg: number
	filters: AgentGetChatsParams
}

export const getHistory = createAsyncThunk<
	History,
	Params,
	{ rejectValue: EnqueueSnackbar }
>('history', async (params, { rejectWithValue }) => {
	try {
		const data: History = await api.getHistory(params.idOrg, params.filters)
		return data
	} catch (err) {
		detectUnauthorized(err, getHistory(params))
		return rejectWithValue(setEnqueueSnackbar(getHistoryError, err))
	}
})

export const getMaxEntries = createAsyncThunk<
	number,
	{ idOrg: number; filters: MaxEntriesParams },
	{ rejectValue: EnqueueSnackbar }
>('maxEntries', async (params, { rejectWithValue }) => {
	try {
		const data = await api.getMaxEntries(params.idOrg, params.filters)
		return data > 0 ? data : 0
	} catch (err) {
		detectUnauthorized(err, getMaxEntries(params))
		return rejectWithValue(setEnqueueSnackbar(getHistoryError, err))
	}
})

export const getInteractionHistory = createAsyncThunk<
	InteractionHistory[],
	InteractionHistoryParams,
	{ rejectValue: EnqueueSnackbar }
>('interactionHistory', async (params, { rejectWithValue }) => {
	try {
		const { conversationId, idOrg } = params
		const data = await api.getInteractionHistory(idOrg, conversationId)
		return data
	} catch (err) {
		detectUnauthorized(err, getInteractionHistory(params))
		return rejectWithValue(
			setEnqueueSnackbar(getInteractionHistoryError, err)
		)
	}
})

export const getAgentChats = createAsyncThunk<
	AttentionInteractionsList,
	AgentChatParams,
	{ rejectValue: EnqueueSnackbar }
>('agent-chats', async (params, { rejectWithValue }) => {
	try {
		const data: AttentionInteractionsList = await api.getAgentChats(
			params.idOrg,
			params.filters
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getAgentChats(params))
		return rejectWithValue(setEnqueueSnackbar(getChatsError, err))
	}
})

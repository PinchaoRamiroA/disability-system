import { createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/services/api/humanAgent'
import { EnqueueSnackbar } from '@/types/notistack'
import { setEnqueueSnackbar } from '@/utils/helpers/enqueueSnackbar'
import {
	geChatsError,
	getAgentsChatsError,
	getAvgTimeError,
	getEscalatedChatsError,
} from '@/utils/constants/snackbars/humanAgent'
import {
	AvgTime,
	AvgTimeParams,
	EscalatedChats,
	EscalatedChatsParams,
	AgentsChats,
	AgentsChatsParams,
} from '@/types/HumanAgent'
import { OverallChats, OverallChatsParams } from '@/types/HumanAgent/Chats'
import { detectUnauthorized } from '@/utils/helpers/detectUnauthorized'

// Chats en general
export const getChats = createAsyncThunk<
	OverallChats,
	OverallChatsParams,
	{ rejectValue: EnqueueSnackbar }
>('humanAgents/stats/chats', async (args, { rejectWithValue }) => {
	try {
		const data = await api.getChats(args)
		return data
	} catch (err) {
		detectUnauthorized(err, getChats(args))
		return rejectWithValue(setEnqueueSnackbar(geChatsError, err))
	}
})

export const getEscalatedChats = createAsyncThunk<
	EscalatedChats,
	EscalatedChatsParams,
	{ rejectValue: EnqueueSnackbar }
>('humanAgents/stats/getChats', async (params, { rejectWithValue }) => {
	try {
		const data: EscalatedChats = await api.getEscalatedChats(
			params.idOrg,
			params.filters
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getEscalatedChats(params))
		return rejectWithValue(setEnqueueSnackbar(getEscalatedChatsError, err))
	}
})

export const getAvgTime = createAsyncThunk<
	AvgTime,
	AvgTimeParams,
	{ rejectValue: EnqueueSnackbar }
>('humanAgents/stats/getTime', async (params, { rejectWithValue }) => {
	try {
		const data: AvgTime = await api.getAvgTime(params.idOrg, params.filters)
		return data
	} catch (err) {
		detectUnauthorized(err, getAvgTime(params))
		return rejectWithValue(setEnqueueSnackbar(getAvgTimeError, err))
	}
})

export const getAgentsChats = createAsyncThunk<
	AgentsChats,
	AgentsChatsParams,
	{ rejectValue: EnqueueSnackbar }
>('humanAgents/stats/getAgentsChats', async (params, { rejectWithValue }) => {
	try {
		const data: AgentsChats = await api.getAgentsChats(
			params.idOrg,
			params.filters
		)
		return data
	} catch (err) {
		detectUnauthorized(err, getAgentsChats(params))
		return rejectWithValue(setEnqueueSnackbar(getAgentsChatsError, err))
	}
})

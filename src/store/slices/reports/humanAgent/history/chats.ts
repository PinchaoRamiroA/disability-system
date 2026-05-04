import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getAgentChats } from './actions'
import { AttentionInteractionsList } from '@/types/reports/humanAgent/History'

const initialState: ReducerType<AttentionInteractionsList> = {
	getStatus: 'idle',
	resource: {
		currentPage: 0,
		currentResults: 0,
		interactions: [],
		totalPages: 0,
		totalResult: 0,
	},
}

const Slice = createSlice({
	name: 'agent-chats',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAgentChats.pending, (state) => {
				;(state.getStatus = 'pending'),
					(state.resource = initialState.resource)
			})
			.addCase(
				getAgentChats.fulfilled,
				(state, action: PayloadAction<AttentionInteractionsList>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getAgentChats.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectAgentChatHistory = (state: AppState) =>
	state.agentChatsHistory
export const agentChatHistorySelector = createSelector(
	selectAgentChatHistory,
	(state) => state
)

export const agentChatsHistoryReducer = Slice.reducer

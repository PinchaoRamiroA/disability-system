import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getChats } from './actions'
import { OverallChats } from '@/types/HumanAgent/Chats'

const initialState: ReducerType<OverallChats> = {
	getStatus: 'idle',
	resource: {
		data: [],
		summary: [],
	},
}

const Slice = createSlice({
	name: 'humanAgent/stats/chats',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getChats.pending, (state) => {
				;(state.getStatus = 'pending'),
					(state.resource = initialState.resource)
			})
			.addCase(
				getChats.fulfilled,
				(state, action: PayloadAction<OverallChats>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getChats.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectChats = (state: AppState) => state.chats
export const overallChatsSelector = createSelector(
	selectChats,
	(state) => state
)

export const chatsReducer = Slice.reducer

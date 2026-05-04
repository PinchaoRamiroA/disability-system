import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getInteractionHistory } from './actions'
import { InteractionHistory } from '@/types/reports/humanAgent/History'

const initialState: ReducerType<InteractionHistory[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'history-interaction',
	initialState,
	reducers: {
		emptyConversation: () => {
			return initialState
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getInteractionHistory.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getInteractionHistory.fulfilled,
				(state, action: PayloadAction<InteractionHistory[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getInteractionHistory.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const { emptyConversation } = Slice.actions

export const selectInteractionHistory = (state: AppState) =>
	state.interactionHistory
export const interactionHistorySelector = createSelector(
	selectInteractionHistory,
	(state) => state
)

export const interactionHistoryReducer = Slice.reducer

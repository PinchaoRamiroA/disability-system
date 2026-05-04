import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getHistory } from './actions'
import { History } from '@/types/reports/humanAgent/History'

const initialState: ReducerType<History> = {
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
	name: 'history',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getHistory.pending, (state) => {
				;(state.getStatus = 'pending'),
					(state.resource = initialState.resource)
			})
			.addCase(
				getHistory.fulfilled,
				(state, action: PayloadAction<History>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getHistory.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectHistory = (state: AppState) => state.history
export const historySelector = createSelector(selectHistory, (state) => state)

export const historyReducer = Slice.reducer

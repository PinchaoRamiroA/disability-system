import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getAccessLog } from './actions'
import { AccessLogs } from '@/types/reports/humanAgent/Access'

const initialState: ReducerType<AccessLogs> = {
	getStatus: 'idle',
	resource: {
		currentPage: 0,
		currentResults: 0,
		entriesConsumers: [],
		totalPages: 0,
		totalResult: 0,
	},
}

const Slice = createSlice({
	name: 'accessLog',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAccessLog.pending, (state) => {
				;(state.getStatus = 'pending'),
					(state.resource = initialState.resource)
			})
			.addCase(
				getAccessLog.fulfilled,
				(state, action: PayloadAction<AccessLogs>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getAccessLog.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectAccess = (state: AppState) => state.access
export const accessSelector = createSelector(selectAccess, (state) => state)

export const accessReducer = Slice.reducer

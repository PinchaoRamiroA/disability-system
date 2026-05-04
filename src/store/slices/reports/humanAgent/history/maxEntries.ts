import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getMaxEntries } from './actions'

const initialState: ReducerType<number> = {
	getStatus: 'idle',
	resource: 0,
}

const Slice = createSlice({
	name: 'access-maxEntries',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getMaxEntries.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getMaxEntries.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getMaxEntries.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectMaxEntries = (state: AppState) => state.maxEntries
export const maxEntriesSelector = createSelector(
	selectMaxEntries,
	(state) => state
)

export const maxEntriesReducer = Slice.reducer

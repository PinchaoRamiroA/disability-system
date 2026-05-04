import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getAgentSplits } from './actions'
import { SplitsAsesor } from '@/types/Splits'

const initialState: ReducerType<SplitsAsesor[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'splits-asesor',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAgentSplits.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getAgentSplits.fulfilled,
				(state, action: PayloadAction<SplitsAsesor[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getAgentSplits.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectSplitsAsesor = (state: AppState) => state.splitsAsesor
export const splitsAsesorSelector = createSelector(
	selectSplitsAsesor,
	(state) => state
)

export const splitsAsesorReducer = Slice.reducer

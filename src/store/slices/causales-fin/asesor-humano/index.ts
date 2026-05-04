import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getCausalesFinActivas } from '../actions'
import { Causal } from '@/types/Causales'

const initialState: ReducerType<Causal[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'causales-negocio-ah',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCausalesFinActivas.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getCausalesFinActivas.fulfilled,
				(state, action: PayloadAction<Causal[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getCausalesFinActivas.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectCausalesFinAH = (state: AppState) => state.causalesFinAH
export const causalesNegocioAHSelector = createSelector(
	selectCausalesFinAH,
	(state) => state
)

export const causalesFinAHReducer = Slice.reducer

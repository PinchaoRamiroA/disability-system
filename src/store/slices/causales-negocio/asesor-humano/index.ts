import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getCausalesNegocioActivas } from '../actions'
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
			.addCase(getCausalesNegocioActivas.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getCausalesNegocioActivas.fulfilled,
				(state, action: PayloadAction<Causal[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getCausalesNegocioActivas.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectCausalesNegocioAH = (state: AppState) =>
	state.causalesNegocioAH
export const causalesNegocioAHSelector = createSelector(
	selectCausalesNegocioAH,
	(state) => state
)

export const causalesNegocioAHReducer = Slice.reducer

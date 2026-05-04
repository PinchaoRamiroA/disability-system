import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getEstadisticaCausalesFin } from '../actions'
import { EstadisticaCausales } from '@/types/Causales'

const initialState: ReducerType<EstadisticaCausales> = {
	getStatus: 'idle',
	resource: {
		Causales: {},
		Total: 0,
	},
}

const Slice = createSlice({
	name: 'causales-fin/estadistica',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getEstadisticaCausalesFin.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getEstadisticaCausalesFin.fulfilled,
				(state, action: PayloadAction<EstadisticaCausales>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getEstadisticaCausalesFin.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectEstadisticaCausalesFin = (state: AppState) =>
	state.estadisticaCausalesFin
export const estadisticaCausalesFinSelector = createSelector(
	selectEstadisticaCausalesFin,
	(state) => state
)

export const estadisticaCausalesFinReducer = Slice.reducer

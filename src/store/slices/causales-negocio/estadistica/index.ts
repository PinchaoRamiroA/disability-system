import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getEstadisticaCausalesNegocio } from '../actions'
import { EstadisticaCausales } from '@/types/Causales'

const initialState: ReducerType<EstadisticaCausales> = {
	getStatus: 'idle',
	resource: {
		Causales: {},
		Total: 0,
	},
}

const Slice = createSlice({
	name: 'causales-negocio/estadistica',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getEstadisticaCausalesNegocio.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getEstadisticaCausalesNegocio.fulfilled,
				(state, action: PayloadAction<EstadisticaCausales>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getEstadisticaCausalesNegocio.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectEstadisticaCausalesNegocio = (state: AppState) =>
	state.estadisticaCausalesNegocio
export const estadisticaCausalesNegocioSelector = createSelector(
	selectEstadisticaCausalesNegocio,
	(state) => state
)

export const estadisticaCausalesNegocioReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getEstadisticaPasoAutomatico } from '../actions'
import { EstadisticaCausales } from '@/types/Causales'

const initialState: ReducerType<EstadisticaCausales> = {
	getStatus: 'idle',
	resource: {
		Causales: {},
		Total: 0,
	},
}

const Slice = createSlice({
	name: 'paso-automatico/estadistica',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getEstadisticaPasoAutomatico.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getEstadisticaPasoAutomatico.fulfilled,
				(state, action: PayloadAction<EstadisticaCausales>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getEstadisticaPasoAutomatico.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectEstadisticaPasoAutomatico = (state: AppState) =>
	state.estadisticaPasoAutomatico
export const estadisticaPasoAutomaticoSelector = createSelector(
	selectEstadisticaPasoAutomatico,
	(state) => state
)

export const estadisticaPasoAutomaticoReducer = Slice.reducer

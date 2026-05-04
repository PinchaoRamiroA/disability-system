import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getEstadoActual } from './actions'
import { EstadoActual } from '@/types/HumanAgent/EstadoAsesores'

const initialState: ReducerType<EstadoActual[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'stats/humanAgent/estadoActual',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getEstadoActual.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getEstadoActual.fulfilled,
				(state, action: PayloadAction<EstadoActual[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getEstadoActual.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectEstados = (state: AppState) => state.estadoActualAsesores
export const estadoActualSelector = createSelector(
	selectEstados,
	(state) => state
)

export const estadoActualAsesoresReducer = Slice.reducer

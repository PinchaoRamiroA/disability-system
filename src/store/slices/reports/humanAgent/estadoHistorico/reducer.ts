import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getEstadoHistorico } from './actions'
import { EstadoHistorico } from '@/types/HumanAgent/EstadoAsesores'

const initialState: ReducerType<EstadoHistorico> = {
	getStatus: 'idle',
	resource: {
		connections: [],
		currentPage: 0,
		currentResults: 10,
		totalPages: 0,
		totalResult: 0,
	},
}

const Slice = createSlice({
	name: 'reports/humanAgent/estadoHistorico',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getEstadoHistorico.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getEstadoHistorico.fulfilled,
				(state, action: PayloadAction<EstadoHistorico>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getEstadoHistorico.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectHistorico = (state: AppState) =>
	state.estadoHistoricoAsesores
export const estadoHistoricoSelector = createSelector(
	selectHistorico,
	(state) => state
)

export const estadoHistoricoAsesoresReducer = Slice.reducer

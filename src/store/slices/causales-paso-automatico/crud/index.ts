import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getCausalesPasoAutomatico } from '../actions'
import { Causal, CausalPasoAutomatico } from '@/types/Causales'

const initialState: ReducerType<Causal[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'causales-paso-automatico',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCausalesPasoAutomatico.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getCausalesPasoAutomatico.fulfilled,
				(state, action: PayloadAction<CausalPasoAutomatico[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => {
						return {
							idCausal: item.idCause,
							nombre: item.nombre,
							activo: true,
							descripcion: '',
							fechaActualizacion: '',
							fechaCreacion: '',
							id: item.idCause,
							logic_delete: 1,
						}
					})
				}
			)
			.addCase(getCausalesPasoAutomatico.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectCausalesPasoAutomatico = (state: AppState) =>
	state.causalesPasoAutomatico
export const causalesPasoAutomaticoSelector = createSelector(
	selectCausalesPasoAutomatico,
	(state) => state
)

export const causalesPasoAutomaticoReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getParametros, updateParametros } from './actions'
import { ParametrosGenerales } from '@/types/Settings/General/Parametros'

const initialState: ReducerType<ParametrosGenerales> = {
	getStatus: 'idle',
	resource: {
		diasLaborales: '',
		horaLaboralFin: '',
		horaLaboralInicio: '',
		nroMaximoChatsAsesor: 0,
		tiempoInactividadCliente: 0,
	},
}

const Slice = createSlice({
	name: 'parametros',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getParametros.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getParametros.fulfilled,
				(state, action: PayloadAction<ParametrosGenerales>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getParametros.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateParametros.fulfilled,
				(state, action: PayloadAction<ParametrosGenerales>) => {
					state.resource = action.payload
				}
			)
	},
})

export const selectParametros = (state: AppState) => state.parametros
export const parametrosSelector = createSelector(
	selectParametros,
	(state) => state
)

export const parametrosReducer = Slice.reducer

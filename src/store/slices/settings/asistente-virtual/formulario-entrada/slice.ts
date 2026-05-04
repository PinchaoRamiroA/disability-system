import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	getFormEntrada,
	sortFormEntrada,
	updateFormEntradaField,
} from './actions'
import { AppState } from '@/store/index'
import { FormEntrada } from '@/types/Settings/asistente-virtual/FormularioEntrada'

const initialState: ReducerType<FormEntrada[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'config-formulario-entrada',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getFormEntrada.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getFormEntrada.fulfilled,
				(state, action: PayloadAction<FormEntrada[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getFormEntrada.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateFormEntradaField.fulfilled,
				(state, action: PayloadAction<FormEntrada[]>) => {
					state.resource = action.payload
				}
			)
			.addCase(
				sortFormEntrada.fulfilled,
				(state, action: PayloadAction<FormEntrada[]>) => {
					state.resource = action.payload
				}
			)
	},
})

export const selectFormEntrada = (state: AppState) => state.configFormEntrada
export const formularioEntradaSelector = createSelector(
	selectFormEntrada,
	(state) => state
)

export const configFormEntradaReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getFullConfigMensajes } from './actions'
import { MensajesConfig } from '@/types/Settings/Mensajes'

const initialState: ReducerType<MensajesConfig[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'full-config-mensajes',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getFullConfigMensajes.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getFullConfigMensajes.fulfilled,
				(state, action: PayloadAction<MensajesConfig[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getFullConfigMensajes.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectFullConfigMensajes = (state: AppState) =>
	state.fullConfigMensajes
export const fullConfigMensajesSelector = createSelector(
	selectFullConfigMensajes,
	(state) => state
)

export const fullConfigMensajesReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getMensajesConfig, updateMensajeConfig } from './actions'
import { MensajesConfig } from '@/types/Settings/Mensajes'
import { EndConversationCommand } from '@/types/HumanAgent/WebChat'

const initialState: ReducerType<MensajesConfig[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'config-mensajes',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getMensajesConfig.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getMensajesConfig.fulfilled,
				(state, action: PayloadAction<MensajesConfig[]>) => {
					const ordenEspecifico: EndConversationCommand[] = [
						'CCCNE',
						'FCCC',
						'FCCA',
						'FCTIC',
						'FCTIA',
						'FCFHL',
					]
					const datosOrdenados = action.payload.sort((a, b) => {
						const indexA = ordenEspecifico.indexOf(a.acronym)
						const indexB = ordenEspecifico.indexOf(b.acronym)

						return indexA - indexB
					})

					state.getStatus = 'resolved'
					state.resource = datosOrdenados.map((item) =>
						ordenEspecifico.includes(item.acronym)
							? { ...item, fin: true }
							: item
					)
				}
			)
			.addCase(getMensajesConfig.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateMensajeConfig.fulfilled,
				(state, action: PayloadAction<MensajesConfig>) => {
					const { clientMessage, idEndTypeConversation } =
						action.payload
					state.resource = state.resource.map((item) => {
						if (
							item.idEndTypeConversation === idEndTypeConversation
						) {
							return {
								...item,
								clientMessage,
							}
						}
						return item
					})
				}
			)
	},
})

export const selectConfigMensajes = (state: AppState) => state.configMensajes
export const configMensajesSelector = createSelector(
	selectConfigMensajes,
	(state) => state
)

export const configMensajesReducer = Slice.reducer

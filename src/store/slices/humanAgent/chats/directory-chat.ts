import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'
import {
	ContactBAH,
	ContactBAHPayload,
} from '@/types/Settings/asesor-humano/directorio'

const initialState: Partial<ContactBAH> = {
	idCiudad: 0,
	ciudad: '',
	departamento: '',
	email: '',
	identificacion: '',
	idVa: 0,
	listadoMensajes: [],
	nombre: '',
	telefono: '',
	tipoIdentificacion: 'CÉDULA CIUDADANIA',
}

const chatsSlice = createSlice({
	name: 'directorio-ah',
	initialState,
	reducers: {
		selectDirectoryContact: (_, action: PayloadAction<ContactBAH>) =>
			action.payload,
		updateDirectoryChat: (
			_,
			action: PayloadAction<Partial<ContactBAHPayload>>
		) => action.payload,
		removeDirectoryContact: () => initialState,
	},
})

export const {
	selectDirectoryContact,
	removeDirectoryContact,
	updateDirectoryChat,
} = chatsSlice.actions

export const HADirectoryState = (state: AppState) => state.humanAgentDirectory
export const humanAgentDirectorySelector = createSelector(
	HADirectoryState,
	(state) => state
)

export const humanAgentDirectoryReducer = chatsSlice.reducer

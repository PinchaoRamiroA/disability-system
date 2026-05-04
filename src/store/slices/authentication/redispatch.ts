import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type CallBack = () => void
interface RedispatchActions {
	actions: unknown[]
	callbacks: CallBack[]
}

// Define el estado inicial del reducer
const initialState: RedispatchActions = {
	actions: [],
	callbacks: [],
}

// Crea un slice de Redux con un reducer y acciones
const Slice = createSlice({
	name: 'redispatchActions',
	initialState,
	reducers: {
		addDispatchAction: (state, action: PayloadAction<unknown>) => {
			state.actions.push(action.payload)
		},
		addCallbackAction: (state, action: PayloadAction<CallBack>) => {
			state.callbacks.push(action.payload)
		},
		clearDispatchActions: () => initialState,
	},
})

// Exporta las acciones generadas automáticamente por createSlice
export const { addCallbackAction, addDispatchAction, clearDispatchActions } =
	Slice.actions

// Exporta el reducer
export const redispatchReducer = Slice.reducer

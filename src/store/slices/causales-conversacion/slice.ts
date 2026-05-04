import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'
import { CausalConversacion } from '@/types/Causales'

interface AdditionProps {
	conversationId: number
	splitId?: number
	transfer?: boolean
}

const initialState: CausalConversacion[] = []

const slice = createSlice({
	name: 'causales-conversacion',
	initialState,
	reducers: {
		addCausalConversacion: (
			state,
			action: PayloadAction<AdditionProps>
		) => {
			// Validar si ya existe un registro con el mismo id de conversación
			const existingIndex = state.findIndex(
				(item) => item.conversationId === action.payload.conversationId
			)
			if (existingIndex !== -1) {
				// Si ya existe, reiniciar el valor de business a [] y ending a null
				state[existingIndex].business = []
				state[existingIndex].ending = null
				// Actualizar cualquier otra propiedad si es necesario
				state[existingIndex].splitId = action.payload.splitId
				state[existingIndex].transfer = action.payload.transfer
			} else {
				// Si no existe, añadir el nuevo registro
				state.push({
					...action.payload,
					business: [],
					ending: null,
				})
			}
		},
		updateCausalConversacion: (
			state,
			action: PayloadAction<CausalConversacion>
		) => {
			return state.map((item) => {
				if (item.conversationId === action.payload.conversationId) {
					return {
						...item,
						...action.payload,
					}
				}
				return item
			})
		},
		updateCausalFromTransferError: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			return state.map((item) => {
				if (item.conversationId === action.payload.conversationId) {
					return {
						...item,
						splitId: undefined,
						transfer: undefined,
					}
				}
				return item
			})
		},
		removeCausalConversacion: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload

			return state.filter(
				(item) => item.conversationId !== conversationId
			)
		},
	},
})

export const {
	addCausalConversacion,
	removeCausalConversacion,
	updateCausalConversacion,
	updateCausalFromTransferError,
} = slice.actions

export const causalesConversacionState = (state: AppState) =>
	state.causalesConversacion
export const causalesConversacionSelector = createSelector(
	causalesConversacionState,
	(state) => state
)

export const causalesConversacionReducer = slice.reducer

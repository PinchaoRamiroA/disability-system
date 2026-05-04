import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getChatsEnCola } from './actions'
import { AppState } from '../..'
import { EstadoChats } from '@/types/Statistics/HumanAgent/EstadoChats'
import moment from 'moment'

const initialState: ReducerType<EstadoChats[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'estado-chats',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getChatsEnCola.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getChatsEnCola.fulfilled,
				(state, action: PayloadAction<EstadoChats[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => ({
						...item,
						id: Number(item.idConv),
						idConv: item.idConv.toString(),
						fechaEntrada: moment(item.fechaEntrada).format(
							'DD/MM/YYYY HH:mm:ss'
						),
					}))
				}
			)
			.addCase(getChatsEnCola.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectEstadoChats = (state: AppState) => state.estadoChats

export const estadoChatsSelector = createSelector(
	selectEstadoChats,
	(state) => state
)

export const estadoChatsReducer = Slice.reducer

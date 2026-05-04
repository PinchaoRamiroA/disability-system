import { ReducerType } from '@/types/Reducer'
import { VirtualAgent } from '@/types/VirtualAgent'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getVirtualAgents } from './actions'

const initialState: ReducerType<VirtualAgent[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'idVa',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getVirtualAgents.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getVirtualAgents.fulfilled,
				(state, action: PayloadAction<VirtualAgent[]>) => {
					state.getStatus = 'resolved'
					// Ordenar por ID
					state.resource = action.payload
						.map((va) => {
							return {
								idVa: va.idVa,
								name: va.name,
								id: va.idVa,
								label: va.name,
							}
						})
						.sort((a, b) => a.id - b.id)
				}
			)
			.addCase(getVirtualAgents.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const virtualAgents = (state: AppState) => state.virtualAgents
export const virtualAgentsSelector = createSelector(
	virtualAgents,
	(state) => state
)

export const virtualAgentsReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getAgents } from './actions'
import { Agents } from '@/types/HumanAgent/Agents'

const initialState: ReducerType<Agents[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'agents',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAgents.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getAgents.fulfilled,
				(state, action: PayloadAction<Agents[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getAgents.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectAgents = (state: AppState) => state.agents
export const agentsSelector = createSelector(selectAgents, (state) => state)

export const agentsReducer = Slice.reducer

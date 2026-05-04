import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getIntegrations } from './actions'
import { Integrations } from '@/types/Statistics/VirtualAgent/Integrations'

const initialState: ReducerType<Integrations> = {
	getStatus: 'idle',
	resource: {
		currentPage: 0,
		currentResults: 0,
		integrationsResult: [],
		totalPages: 0,
		totalResult: 0,
		totalFailed: 0,
		totalSuccess: 0,
	},
}

const Slice = createSlice({
	name: 'virtual-agent/integrations',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getIntegrations.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getIntegrations.fulfilled,
				(state, action: PayloadAction<Integrations>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getIntegrations.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const integrations = (state: AppState) => state.integrationsLog
export const integrationsLogSelector = createSelector(
	integrations,
	(state) => state
)

export const integrationsLogReducer = Slice.reducer

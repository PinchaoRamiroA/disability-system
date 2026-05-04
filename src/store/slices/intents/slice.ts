import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { Intents } from '@/types/Intents'
import { getIntents } from './actions'

const initialState: ReducerType<Intents> = {
	getStatus: 'idle',
	resource: {
		count: 0,
		detail: [],
	},
}

const slice = createSlice({
	name: 'intents',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getIntents.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getIntents.fulfilled,
				(state, action: PayloadAction<Intents>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getIntents.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectIntents = (state: AppState) => state.intents
export const intentsSelector = createSelector(selectIntents, (state) => state)

export const intentsReducer = slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import {
	createPauseEvent,
	deletePauseEvent,
	getPauseEvents,
	updatePauseEvent,
} from './actions'
import { PauseEvent } from '@/types/PauseEvents'

const initialState: ReducerType<PauseEvent[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'splits',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getPauseEvents.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getPauseEvents.fulfilled,
				(state, action: PayloadAction<PauseEvent[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getPauseEvents.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createPauseEvent.fulfilled,
				(state, action: PayloadAction<PauseEvent>) => {
					state.getStatus = 'resolved'
					state.resource = [action.payload].concat(state.resource)
				}
			)
			.addCase(
				updatePauseEvent.fulfilled,
				(state, action: PayloadAction<PauseEvent>) => {
					state.resource = state.resource.map((item) => {
						if (item.id === action.payload.id) {
							return { ...item, ...action.payload }
						}
						return item
					})
				}
			)
			.addCase(
				deletePauseEvent.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.resource = state.resource.filter(
						(item) => item.id !== action.payload
					)
				}
			)
	},
})

export const selectPauseEvents = (state: AppState) => state.pauseEvents
export const pauseEventsSelector = createSelector(
	selectPauseEvents,
	(state) => state
)

export const pauseEventsReducer = Slice.reducer

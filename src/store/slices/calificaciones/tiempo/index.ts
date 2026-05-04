import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getIntentsTimeRating } from '../actions'
import { IntentsTimeRating } from '@/types/Statistics/VirtualAgent/Calificaciones'

const initialState: ReducerType<IntentsTimeRating[]> = {
	getStatus: 'idle',
	resource: [],
}

const slice = createSlice({
	name: 'intents-time-rating',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getIntentsTimeRating.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getIntentsTimeRating.fulfilled,
				(state, action: PayloadAction<IntentsTimeRating[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getIntentsTimeRating.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectIntentsTimeRating = (state: AppState) =>
	state.intentsTimeRating
export const intentsTimeRatingSelector = createSelector(
	selectIntentsTimeRating,
	(state) => state
)

export const intentsTimeRatingReducer = slice.reducer

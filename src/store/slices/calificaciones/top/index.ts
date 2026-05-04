import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getIntentsTopRating } from '../actions'
import { TopRating } from '@/types/Statistics/VirtualAgent/Calificaciones'

const initialState: ReducerType<TopRating> = {
	getStatus: 'idle',
	resource: {
		count: 0,
		countFailed: 0,
		countSuccess: 0,
		detail: [],
	},
}

const slice = createSlice({
	name: 'top-rating',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getIntentsTopRating.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getIntentsTopRating.fulfilled,
				(state, action: PayloadAction<TopRating>) => {
					state.getStatus = 'resolved'
					state.resource = {
						count: action.payload.count,
						countFailed: action.payload.countFailed ?? 0,
						countSuccess: action.payload.countSuccess ?? 0,
						detail: action.payload.detail ?? [],
					}
				}
			)
			.addCase(getIntentsTopRating.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectTopRating = (state: AppState) => state.topRating
export const topRatingsSelector = createSelector(
	selectTopRating,
	(state) => state
)

export const topRatingsReducer = slice.reducer

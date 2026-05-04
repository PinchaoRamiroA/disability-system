import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { IntentsQuantities } from '@/types/Intents'
import { getIntentsQuantities } from '../actions'

const initialState: ReducerType<IntentsQuantities[]> = {
	getStatus: 'idle',
	resource: [],
}

const IntentsSlice = createSlice({
	name: 'intents-filter',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getIntentsQuantities.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getIntentsQuantities.fulfilled,
				(state, action: PayloadAction<IntentsQuantities[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((el) => {
						return {
							id: el.id,
							quantity: el.quantity,
							name: el.name,
							label: el.name,
						}
					})
				}
			)
			.addCase(getIntentsQuantities.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectIntentsQuantities = (state: AppState) =>
	state.intentsQuantities
export const intentsQuantitiesSelector = createSelector(
	selectIntentsQuantities,
	(state) => state
)

export const intentsQuantitiesReducer = IntentsSlice.reducer

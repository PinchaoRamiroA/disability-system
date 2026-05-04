import { AppState } from '../..'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { NotificationTypes } from '@/types/Notifications'
import { ReducerType } from '@/types/Reducer'
import { getNotificationTypes } from './actions'
import { resetFilter } from '../Filter'

const initialState: ReducerType<NotificationTypes> = {
	getStatus: 'idle',
	resource: {
		types: [],
	},
}

const Slice = createSlice({
	name: 'stats/notificationTypes',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotificationTypes.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getNotificationTypes.fulfilled,
				(state, action: PayloadAction<NotificationTypes>) => {
					state.getStatus = 'resolved'
					state.resource.types = action.payload.types.map((type) => ({
						checked: true,
						name: type.name,
						typeNotificationId: type.typeNotificationId,
					}))
				}
			)
			.addCase(getNotificationTypes.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(resetFilter, (state) => {
				state.resource.types = state.resource.types.map((ch) => ({
					...ch,
					checked: true,
				}))
			})
	},
})

export const selectNotificationTypes = (state: AppState) =>
	state.notificationTypes
export const notificationTypesSelector = createSelector(
	selectNotificationTypes,
	(state) => state
)

export const notificationTypesReducer = Slice.reducer

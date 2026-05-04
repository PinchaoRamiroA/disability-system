import { AppState } from '../..'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { NotificationsEvents } from '@/types/Notifications'
import { ReducerType } from '@/types/Reducer'
import { getNotificationEvents } from './actions'

const initialState: ReducerType<NotificationsEvents> = {
	getStatus: 'idle',
	resource: {
		count: 0,
		detail: [],
	},
}

const Slice = createSlice({
	name: 'stats/notificationsEvents',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotificationEvents.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getNotificationEvents.fulfilled,
				(state, action: PayloadAction<NotificationsEvents>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getNotificationEvents.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectNotificationsEvents = (state: AppState) =>
	state.notificationEvents
export const notificationsEventsSelector = createSelector(
	selectNotificationsEvents,
	(state) => state
)

export const notificationsEventsReducer = Slice.reducer

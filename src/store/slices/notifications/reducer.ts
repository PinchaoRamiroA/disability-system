import { AppState } from '../..'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Notifications } from '@/types/Notifications'
import { ReducerType } from '@/types/Reducer'
import { getNotifications } from './actions'

const initialState: ReducerType<Notifications> = {
	getStatus: 'idle',
	resource: {
		data: [],
		summary: [],
	},
}

const Slice = createSlice({
	name: 'stats/notifications',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotifications.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getNotifications.fulfilled,
				(state, action: PayloadAction<Notifications>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getNotifications.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectNotifications = (state: AppState) => state.notifications
export const notificationsSelector = createSelector(
	selectNotifications,
	(state) => state
)

export const notificationsReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../'
import { getNotifLogs } from './actions'
import { NotificationLogs } from '@/types/reports/notifications'

const initialState: ReducerType<NotificationLogs> = {
	getStatus: 'idle',
	resource: {
		notificationsLog: [],
		totalPages: 0,
		totalResult: 0,
	},
}

const Slice = createSlice({
	name: 'notificationsLogs',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotifLogs.pending, (state) => {
				;(state.getStatus = 'pending'),
					(state.resource = initialState.resource)
			})
			.addCase(
				getNotifLogs.fulfilled,
				(state, action: PayloadAction<NotificationLogs>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getNotifLogs.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectNotifLogs = (state: AppState) => state.notificationsLogs
export const notifLogsSelector = createSelector(
	selectNotifLogs,
	(state) => state
)

export const notificationsLogsReducer = Slice.reducer

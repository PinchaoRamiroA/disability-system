import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EventsConfig } from '@/types/Notificaciones'
import { ReducerType } from '@/types/Reducer'
import { getNotificaciones } from './actions'
import { AppState } from '../..'

const initialState: ReducerType<EventsConfig[]> = {
	getStatus: 'idle',
	resource: [],
}

// Slice reducer
const notificationsSlice = createSlice({
	name: 'notifications-config',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotificaciones.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = []
			})
			.addCase(
				getNotificaciones.fulfilled,
				(state, action: PayloadAction<EventsConfig[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getNotificaciones.rejected, (state) => {
				// Modifica el estado si la solicitud es rechazada
				state.getStatus = 'rejected'
				state.resource = []
			})
	},
})

export const selectNotificationsConfig = (state: AppState) =>
	state.notificationsConfig
export const notificationsConfigSelector = createSelector(
	selectNotificationsConfig,
	(state) => state
)

export const notificationsConfigReducer = notificationsSlice.reducer

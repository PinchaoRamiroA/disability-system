import { ReducerType } from '@/types/Reducer'
import {
	createSelector,
	createSlice,
	nanoid,
	PayloadAction,
} from '@reduxjs/toolkit'

import { AppState } from '@/store/index'
import { createEmail, deleteEmail, getEmails, updateEmail } from './actions'
import { EmailsConfig } from '@/types/Notificaciones'

const initialState: ReducerType<EmailsConfig[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'config-notif-emails',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getEmails.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getEmails.fulfilled,
				(state, action: PayloadAction<EmailsConfig[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => ({
						...item,
						id: nanoid(),
					}))
				}
			)
			.addCase(getEmails.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createEmail.fulfilled,
				(state, action: PayloadAction<EmailsConfig>) => {
					state.resource = [action.payload].concat(state.resource)
				}
			)
			.addCase(
				updateEmail.fulfilled,
				(state, action: PayloadAction<EmailsConfig>) => {
					const { idEmail } = action.payload

					state.resource = state.resource.map((item) => {
						if (item.idEmail === idEmail) {
							return {
								...item,
								...action.payload,
							}
						}
						return item
					})
				}
			)
			.addCase(
				deleteEmail.fulfilled,
				(state, action: PayloadAction<EmailsConfig>) => {
					const { idEmail } = action.payload

					state.resource = state.resource.filter(
						(item) => item.idEmail !== idEmail
					)
				}
			)
	},
})

export const selectEmailsConfig = (state: AppState) => state.emailsConfig
export const emailsConfigSelector = createSelector(
	selectEmailsConfig,
	(state) => state
)

export const emailsConfigReducer = Slice.reducer

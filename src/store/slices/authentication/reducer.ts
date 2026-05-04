import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { logout, loginAsync, login } from './actions'
import { Auth } from '@/types/auth'

const initialState: Auth = {
	user: {
		company: 0,
		email: '',
		nameCompany: '',
		role: 0,
		sub: '',
		exp: 0,
	},
	authenticated: false,
	status: 'idle',
	authType: 'username/passowrd',
}

export const authReducer = createReducer(initialState, (builder) => {
	builder
		// .addCase(login, (_state, action: PayloadAction<Auth>) => action.payload)
		.addCase(logout, () => initialState)
		.addCase(login, (state, action: PayloadAction<Auth>) => {
			return {
				...action.payload,
				authenticated: true,
				authType: state.authType,
				status: 'idle',
			}
		})
		.addCase(loginAsync.pending, (state) => {
			state.status = 'pending'
		})
		.addCase(loginAsync.fulfilled, (state, action: PayloadAction<Auth>) => {
			return {
				...action.payload,
				authenticated: true,
				authType: state.authType,
				status: 'resolved',
			}
		})
		.addCase(loginAsync.rejected, (state) => {
			state.status = 'rejected'
		})
})

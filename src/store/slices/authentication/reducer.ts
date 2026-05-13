import { createReducer } from '@reduxjs/toolkit'
import { thunkLogin, thunkLogout, retrieveLogin } from './actions'

export interface AuthState {
	authenticated: boolean
	email: string | null
	nombre: string | null
	role: string | null
	status: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: AuthState = {
	authenticated: false,
	email: null,
	nombre: null,
	role: null,
	status: 'idle',
}

export const authReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(thunkLogin.pending, (state) => {
			state.status = 'pending'
		})
		.addCase(thunkLogin.fulfilled, (state, action) => {
			state.authenticated = true
			state.email = action.payload.email
			state.nombre = action.payload.nombre
			state.role = action.payload.role
			state.status = 'succeeded'
		})
		.addCase(thunkLogin.rejected, (state) => {
			state.status = 'failed'
		})
		.addCase(thunkLogout.fulfilled, () => initialState)
		.addCase(retrieveLogin.fulfilled, (state, action) => {
			if (action.payload) {
				state.authenticated = true
				state.email = action.payload.email
				state.nombre = action.payload.nombre
				state.role = action.payload.role
			}
		})
})
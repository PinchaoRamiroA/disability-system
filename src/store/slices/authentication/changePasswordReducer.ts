import { createReducer } from '@reduxjs/toolkit'
import { checkChangePassword } from './actions'

interface ChangePasswordState {
	changePassword: 'idle' | 'true' | 'false'
}

const initialState: ChangePasswordState = {
	changePassword: 'idle',
}

export const changePasswordReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(checkChangePassword.rejected, () => initialState)
		.addCase(checkChangePassword.pending, () => initialState)
		.addCase(checkChangePassword.fulfilled, (state, action) => {
			state.changePassword = action.payload ? 'true' : 'false'
		})
})
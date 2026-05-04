import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { checkChangePassword } from './actions'
import { ChangePassValue } from '@/types/auth'

const initialState: ChangePassValue = {
	changePassword: 'idle',
}

export const changePasswordReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(checkChangePassword.rejected, () => {
			return initialState
		})
		.addCase(checkChangePassword.pending, () => {
			return initialState
		})
		.addCase(
			checkChangePassword.fulfilled,
			(_, action: PayloadAction<ChangePassValue>) => {
				return {
					...action.payload,
				}
			}
		)
})

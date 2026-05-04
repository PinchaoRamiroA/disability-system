import { ReducerType } from '@/types/Reducer'
import { NormalizedUser, User } from '@/types/users'
import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import {
	createUser,
	deleteUser,
	getUsers,
	putUsers,
	toggleActiveUser,
} from './actions'
import moment from 'moment'

const initialState: ReducerType<NormalizedUser[]> = {
	getStatus: 'idle',
	resource: [],
}

export const UsersReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(getUsers.pending, (state) => {
			state.getStatus = 'pending'
		})
		.addCase(
			getUsers.fulfilled,
			(state, action: PayloadAction<NormalizedUser[]>) => {
				state.getStatus = 'resolved'
				state.resource = action.payload.map((user) => ({
					...user,
					dateCreate: user.dateCreate
						? moment(user.dateCreate).format('DD/MM/YYYY HH:mm:ss')
						: '',
					dateUpdate: user.dateUpdate
						? moment(user.dateUpdate).format('DD/MM/YYYY HH:mm:ss')
						: '',
				}))
			}
		)
		.addCase(getUsers.rejected, (state) => {
			state.getStatus = 'rejected'
			state.resource = initialState.resource
		})
		.addCase(
			createUser.fulfilled,
			(state, action: PayloadAction<NormalizedUser>) => {
				state.resource = [
					{
						...action.payload,
						dateCreate: moment(action.payload.dateCreate).format(
							'DD/MM/YYYY HH:mm:ss'
						),
					},
				].concat(state.resource)
			}
		)
		.addCase(putUsers.fulfilled, (state, action: PayloadAction<User>) => {
			state.resource = state.resource.map((item) => {
				if (item.idUser === action.payload.idUser) {
					return {
						...item,
						...action.payload,
						dateCreate: item.dateCreate,
						dateUpdate: moment(action.payload.dateUpdate).format(
							'DD/MM/YYYY HH:mm:ss'
						),
					}
				}
				return item
			})
		})
		.addCase(
			toggleActiveUser.fulfilled,
			(state, action: PayloadAction<User>) => {
				const { idUser } = action.payload
				state.resource = state.resource.map((user) => {
					if (user.idUser === idUser) {
						return {
							...user,
							...action.payload,
							dateCreate: user.dateCreate,
							dateUpdate: moment(
								action.payload.dateUpdate
							).format('DD/MM/YYYY HH:mm:ss'),
						}
					}
					return user
				})
			}
		)
		.addCase(
			deleteUser.fulfilled,
			(state, action: PayloadAction<number>) => {
				state.resource = state.resource.filter(
					(item) => item.idUser !== action.payload
				)
			}
		)
})

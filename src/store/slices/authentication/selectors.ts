import { createSelector } from '@reduxjs/toolkit'
import { AppState } from '../..'

export const selectAuth = (state: AppState) => state.auth

export const userSelector = createSelector(selectAuth, (state) => ({
	email: state.email || '',
	role: state.role || '',
	permisos: state.permisos || [],
}))

export const authSelector = createSelector(selectAuth, (state) => ({
	authenticated: state.authenticated,
	user: {
		email: state.email || '',
		role: state.role || '',
		permisos: state.permisos || [],
	},
}))

export const selectChangePassword = (state: AppState) =>
	state.changePasswordReducer?.changePassword || 'idle'

export const changePasswordSelector = createSelector(
	selectChangePassword,
	(state) => state
)
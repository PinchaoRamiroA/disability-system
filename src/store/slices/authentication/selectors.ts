import { createSelector } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'

export const selectAuth = (state: AppState) => state.auth

export const selectUser = (state: AppState) => state.auth.user

export const userSelector = createSelector(selectUser, (state) => state)

export const selectRole = (state: AppState) => state.auth.user.role

export const authSelector = createSelector(selectAuth, (state) => state)

export const selectChangePassword = (state: AppState) =>
	state.changePasswordReducer.changePassword

export const changePasswordSelector = createSelector(
	selectChangePassword,
	(state) => state
)

import { createSelector } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'

export const selectUsers = (state: AppState) => state.users

export const usersSelector = createSelector(selectUsers, (state) => state)

import { createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../..'

const initialState = 100

export const slice = createSlice({
	initialState,
	name: 'notificationsIdCompany',
	reducers: {},
})

export const selectNotifId = (state: AppState) => state.notifId

export const notifIdSelector = createSelector(selectNotifId, (state) => state)

export const notifIdReducer = slice.reducer

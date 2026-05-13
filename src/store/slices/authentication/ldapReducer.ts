import { createSlice } from '@reduxjs/toolkit'

const initialState = false

export const ldapSlice = createSlice({
	initialState,
	name: 'enableLDAP',
	reducers: {
		disableLDAP: () => false,
		enableLDAP: () => true,
	},
})

export const { disableLDAP, enableLDAP } = ldapSlice.actions
export const ldapReducer = ldapSlice.reducer
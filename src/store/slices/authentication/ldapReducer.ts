import { createSelector, createSlice } from '@reduxjs/toolkit'
import { LDAPLogin } from '@/types/auth'
import { AppState } from '../..'

const initialState: LDAPLogin = false

export const ldapSlice = createSlice({
	initialState,
	name: 'enableLDAP',
	reducers: {
		disableLDAP: () => false,
		enableLDAP: () => true,
	},
})

export const { disableLDAP, enableLDAP } = ldapSlice.actions

export const selectLdap = (state: AppState) => state.ldap

export const ldapSelector = createSelector(selectLdap, (state) => state)

export const ldapReducer = ldapSlice.reducer

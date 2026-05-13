import { AnyAction, combineReducers } from '@reduxjs/toolkit'
import { loadingBarReducer } from 'react-redux-loading-bar'
import {
	authReducer,
	notifIdReducer,
	redispatchReducer,
} from './slices/authentication'
import { notistackReducer } from './slices/notistack'
import { drawerReducer } from './slices/drawer'
import { changePasswordReducer } from './slices/authentication/changePasswordReducer'
import { ldapReducer } from './slices/authentication/ldapReducer'

export const combinedReducer = combineReducers({
	loadingBar: loadingBarReducer,
	auth: authReducer,
	changePasswordReducer,
	notistack: notistackReducer,
	drawer: drawerReducer,
	ldap: ldapReducer,
	notifId: notifIdReducer,
	redispatch: redispatchReducer,
})

export const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
	if (action.type === 'auth/logout') {
		state = undefined
	}
	return combinedReducer(state, action)
}
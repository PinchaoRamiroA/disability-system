import {
	createSelector,
	createSlice,
	isAnyOf,
	PayloadAction,
} from '@reduxjs/toolkit'
import { AppState } from '../..'

import { increment, decrement } from '../counter'
import { routeTreeList } from '@/utils/constants/grantAccess'
import { RouteTree } from '@/types/GrantAccess'
import { Auth } from '@/types/auth'
import { loginAsync, login } from '../authentication'

const initialState: RouteTree = routeTreeList[1]

export const routeTreeSlice = createSlice({
	name: 'routeTree',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed

		builder
			.addCase(increment, () => {
				const analyst = routeTreeList[4]

				return analyst
			})
			.addCase(decrement, () => {
				const admin = routeTreeList[3]

				return admin
			})

		builder.addMatcher(
			//can pass multiple RTK action creators here
			isAnyOf(loginAsync.fulfilled, login),
			(_state, action: PayloadAction<Auth>) => {
				const role = action.payload.user.role
				return routeTreeList[role]
			}
		)
	},
})

export const selectRouteTree = (state: AppState) => state.routeTree
export const selectSidebar = (_: AppState, sidebarPath: string) => sidebarPath

export const routeTreeSelector = createSelector(
	selectRouteTree,
	(state) => state
)

export const sidebarSelector = createSelector(
	selectRouteTree,
	selectSidebar,
	(routeTree, sidebarPath) => {
		for (const name of Object.keys(routeTree)) {
			const route = routeTree[name as keyof RouteTree]
			if (route && route.path === sidebarPath) return route
		}
	}
)

//analytics
export const selectAnalyticsRouteTree = (state: AppState) =>
	state.routeTree.analytics

export const analyticsRouteTreeSelector = createSelector(
	selectAnalyticsRouteTree,
	(state) => state
)

export const areAnalyticsGrantedSelector = createSelector(
	analyticsRouteTreeSelector,
	(analytics) => analytics != null
)

//settings
export const selectSettingsRouteTree = (state: AppState) =>
	state.routeTree.settings

export const settingsRouteTreeSelector = createSelector(
	selectSettingsRouteTree,
	(state) => state
)

export const areSettingsGrantedSelector = createSelector(
	settingsRouteTreeSelector,
	(settings) => settings != null
)

//human agent
export const selectChatAccess = (state: AppState) => state.routeTree.chat

export const ChatRouteTreeSelector = createSelector(
	selectChatAccess,
	(state) => state
)

export const isChatGrantedSelector = createSelector(
	ChatRouteTreeSelector,
	(chat) => chat != null
)

export const routeTreeReducer = routeTreeSlice.reducer

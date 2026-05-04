import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { DashboardConfig } from '@/types/Settings/General/Dashboard'
import {
	DASHBOARD_DEFAULT_CONFIG,
	DASHBOARD_STYLES_LS,
} from '@/utils/constants/dashboardConfig'
import { ReducerType } from '@/types/Reducer'
import { getDashboardConfig, updateDashboardConfig } from './actions'

const initialResource = (): DashboardConfig => {
	try {
		const ls = localStorage.getItem(DASHBOARD_STYLES_LS)
		if (ls) {
			return JSON.parse(ls)
		}
		return DASHBOARD_DEFAULT_CONFIG
	} catch (_) {
		return DASHBOARD_DEFAULT_CONFIG
	}
}

const initialState: ReducerType<DashboardConfig> = {
	getStatus: 'idle',
	resource: initialResource(),
}

export const Slice = createSlice({
	name: 'palette',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getDashboardConfig.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getDashboardConfig.fulfilled,
				(state, action: PayloadAction<DashboardConfig>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getDashboardConfig.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateDashboardConfig.fulfilled,
				(state, action: PayloadAction<DashboardConfig>) => {
					state.resource = action.payload
				}
			)
	},
})

const selectCurrentColors = (state: AppState) =>
	state.dashboardStyles.resource.colores

export const currentColorsSelector = createSelector(
	selectCurrentColors,
	(state) => state
)

export const currentHAColorsSelector = createSelector(
	(state: AppState) => state.dashboardStyles.resource.colores.asesorHumano,
	(state) => state
)

export const selectDashboardStyle = (state: AppState) => state.dashboardStyles

export const dashboardStylesSelector = createSelector(
	selectDashboardStyle,
	(state) => state
)

export const dashboardStylesReducer = Slice.reducer

import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getDashboardLogo, updateDashboardLogo } from './actions'
import { LogoType } from '@/types/Settings/General/Dashboard'
import { DASHBOARD_IMAGE_LS } from '@/utils/constants/dashboardConfig'

const initialURL = (): string => {
	try {
		return localStorage.getItem(DASHBOARD_IMAGE_LS) ?? ''
	} catch (_) {
		return ''
	}
}

const initialState: ReducerType<LogoType> = {
	getStatus: 'idle',
	resource: {
		file: null,
		url: initialURL(),
	},
}

const Slice = createSlice({
	name: 'dashboardLogo',
	initialState,
	reducers: {
		updateLogoFile: (state, action: PayloadAction<File>) => {
			return {
				...state,
				resource: {
					...state.resource,
					file: action.payload,
				},
			}
		},
		removeLogoFile: (state) => {
			return {
				...state,
				resource: {
					...state.resource,
					file: null,
				},
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDashboardLogo.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getDashboardLogo.fulfilled,
				(state, action: PayloadAction<LogoType>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getDashboardLogo.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateDashboardLogo.fulfilled,
				(state, action: PayloadAction<LogoType>) => {
					state.resource = action.payload
				}
			)
	},
})

export const { removeLogoFile, updateLogoFile } = Slice.actions

export const selectDashboardLogo = (state: AppState) => state.dashboardLogo
export const dashboardLogoSelector = createSelector(
	selectDashboardLogo,
	(state) => state
)

export const dashboardLogoReducer = Slice.reducer

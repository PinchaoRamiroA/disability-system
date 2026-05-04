import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getWidgetConfig, updateWidgetConfig } from '../actions'
import { WidgetConfig } from '@/types/Settings/General/Widget'
import { WIDGET_CONFIG_DEFAULT } from '@/utils/constants/widgetConfigDefault'

const initialState: ReducerType<WidgetConfig> = {
	getStatus: 'idle',
	resource: WIDGET_CONFIG_DEFAULT,
}

const Slice = createSlice({
	name: 'widgetColor',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getWidgetConfig.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getWidgetConfig.fulfilled,
				(state, action: PayloadAction<WidgetConfig>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getWidgetConfig.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateWidgetConfig.fulfilled,
				(state, action: PayloadAction<WidgetConfig>) => {
					state.resource = action.payload
				}
			)
	},
})

const selectCurrentColors = (state: AppState) =>
	state.widgetConfig.resource.colores

export const widgetCurrentColorsSelector = createSelector(
	selectCurrentColors,
	(state) => state
)

export const widgetCurrentHAColorsSelector = createSelector(
	(state: AppState) => state.widgetConfig.resource.colores.chat.messages,
	(state) => state
)

export const selectWidgetConfig = (state: AppState) => state.widgetConfig
export const widgetConfigSelector = createSelector(
	selectWidgetConfig,
	(state) => state
)

export const widgetConfigReducer = Slice.reducer

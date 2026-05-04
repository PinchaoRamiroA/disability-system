import { AppState } from '@/store/index'
import { ExperienceIndicator, IndiExperienceTypes } from '@/types/Indicators'
import { ReducerType } from '@/types/Reducer'
import {
	createSelector,
	createSlice,
	isAnyOf,
	isPending,
	isRejected,
	PayloadAction,
} from '@reduxjs/toolkit'
import { getNPS, getNS, getRU } from './actions'

const resource: ReducerType<ExperienceIndicator>[] = [
	{
		getStatus: 'idle',
		resource: {
			id: 'NS',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'RU',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'NPS',
			value: '--',
		},
	},
]

const initialState: IndiExperienceTypes = { resource }

export const indicatorSlice = createSlice({
	name: 'experienceIndicators',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				isAnyOf(getNS.fulfilled, getRU.fulfilled, getNPS.fulfilled),
				(state, action: PayloadAction<ExperienceIndicator>) => {
					state.resource = state.resource.map((item) => {
						if (item.resource.id === action.payload.id) {
							return {
								...item,
								getStatus: 'resolved',
								resource: action.payload,
							}
						}
						return item
					})
				}
			)
			.addMatcher(isPending(getNS, getRU, getNPS), (state, action) => {
				state.resource = state.resource.map((item) => {
					if (item.resource.id === action.meta.requestId) {
						return {
							...item,
							getStatus: 'pending',
						}
					}
					return item
				})
			})
			.addMatcher(isRejected(getNS, getRU, getNPS), (state, action) => {
				state.resource = state.resource.map((item) => {
					if (item.resource.id === action.meta.requestId) {
						return {
							...item,
							getStatus: 'rejected',
							resource: { ...item.resource, value: '--' },
						}
					}
					return item
				})
			})
	},
})

export const selectExperienceIndicator = (state: AppState) =>
	state.experienceIndicators
export const experienceIndicatorSelector = createSelector(
	selectExperienceIndicator,
	(state) => state
)

export const experienceIndicatorsReducer = indicatorSlice.reducer

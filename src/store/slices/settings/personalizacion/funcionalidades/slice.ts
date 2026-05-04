import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getFeaturesConfig, updateFeatureConfig } from './actions'
import { AppState } from '@/store/index'
import { ConfigFeature } from '@/types/Settings/personalizacion/funcionalidades'

const initialState: ReducerType<ConfigFeature[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'features-slice',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getFeaturesConfig.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getFeaturesConfig.fulfilled,
				(state, action: PayloadAction<ConfigFeature[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getFeaturesConfig.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateFeatureConfig.fulfilled,
				(state, action: PayloadAction<ConfigFeature>) => {
					const { idFeature } = action.payload
					state.resource = state.resource.map((item) => {
						if (item.idFeature === idFeature) {
							return {
								...item,
								...action.payload,
							}
						}
						return item
					})
				}
			)
	},
})

export const selectFeatures = (state: AppState) => state.features
export const featuresSelector = createSelector(selectFeatures, (state) => state)

export const featuresReducer = Slice.reducer

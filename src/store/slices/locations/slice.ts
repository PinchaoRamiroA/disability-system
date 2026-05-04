import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { Locations } from '@/types/Locations'
import { getLocations } from './actions'
import { sortLocation } from '@/utils/helpers/sortLocations'

const initialState: ReducerType<Locations> = {
	getStatus: 'idle',
	resource: {
		departments: [],
		regions: [],
		cities: [],
	},
}

const LocationsSlice = createSlice({
	name: 'locations',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getLocations.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getLocations.fulfilled,
				(state, action: PayloadAction<Locations>) => {
					state.getStatus = 'resolved'
					state.resource.departments = action.payload.departments
						.map((el) => {
							return {
								id: el.id,
								idRegional: el.idRegional,
								name: el.name,
								label: el.name,
							}
						})
						.sort(sortLocation)

					state.resource.regions = action.payload.regions
						.map((el) => {
							return {
								id: el.id,
								name: el.name,
								label: el.name,
							}
						})
						.sort(sortLocation)

					if (action.payload.cities) {
						state.resource.cities = action.payload.cities
							.map((el) => ({
								id: el.id,
								name: el.name,
								idDepartment: el.idDepartment,
								label: el.name,
							}))
							.sort(sortLocation)
					}
				}
			)
			.addCase(getLocations.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectLocations = (state: AppState) => state.locations
export const locationsSelector = createSelector(
	selectLocations,
	(state) => state
)

export const locationsReducer = LocationsSlice.reducer

import { Filter } from '@/types/Filter/Filter'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { format } from 'date-fns'
import { AppState } from '../..'
const initialState: Filter = {
	start: format(new Date(), 'yyyy-MM-dd'),
	end: format(new Date(), 'yyyy-MM-dd'),
	attention: 'attended',
}

export const Slice = createSlice({
	name: 'temp_filter',
	initialState,
	reducers: {
		updateFields: (state, action: PayloadAction<Filter>) => {
			// Obtener filtros de tipo array
			// const {
			// 	// agents,
			// 	causalesFin,
			// 	causalesNegocio,
			// 	cities,
			// 	departments,
			// 	events,
			// 	intents,
			// 	// splits,
			// 	resolution,
			// } = action.payload
			return {
				...state,
				...action.payload,
				// // agents: agents?.length ? agents : undefined,
				// causalesFin: causalesFin?.length ? causalesFin : undefined,
				// causalesNegocio: causalesNegocio?.length
				// 	? causalesNegocio
				// 	: undefined,
				// cities: cities?.length ? cities : undefined,
				// departments: departments?.length ? departments : undefined,
				// // events: events?.length ? events : undefined,
				// intents: intents?.length ? intents : undefined,
				// // regionals: regionals?.length ? regionals : undefined,
				// resolution: resolution?.length ? resolution : undefined,
				// // splits: splits?.length ? splits : undefined,
			}
		},
		resetFilter: () => initialState,
	},
})

export const { updateFields: updateTempFields, resetFilter } = Slice.actions

export const selectTempFilter = (state: AppState) => state.tempFilter
export const filterTempSelector = createSelector(
	selectTempFilter,
	(state) => state
)

export const tempFilterReducer = Slice.reducer

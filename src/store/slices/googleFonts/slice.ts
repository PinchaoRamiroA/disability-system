import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getGoogleFonts } from './actions'
import { GoogleFont } from '@/types/Settings/General/Widget'

const initialState: ReducerType<GoogleFont[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'causales/reporte',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getGoogleFonts.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getGoogleFonts.fulfilled,
				(state, action: PayloadAction<GoogleFont[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getGoogleFonts.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectGoogleFonts = (state: AppState) => state.googleFonts
export const googleFontsSelector = createSelector(
	selectGoogleFonts,
	(state) => state
)

export const googleFontsReducer = Slice.reducer

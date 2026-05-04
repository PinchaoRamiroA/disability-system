import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getExpiracionConfig, updateExpiracionConfig } from './actions'
import { AppState } from '@/store/index'
import { ExpiracionSesion } from '@/types/Settings/asistente-virtual/Expiracion'

const initialState: ReducerType<ExpiracionSesion[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'config-expiracion',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getExpiracionConfig.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getExpiracionConfig.fulfilled,
				(state, action: PayloadAction<ExpiracionSesion[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getExpiracionConfig.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateExpiracionConfig.fulfilled,
				(state, action: PayloadAction<ExpiracionSesion>) => {
					const {
						clientMessage,
						closingTime,
						idSessionExpirationType,
					} = action.payload
					state.resource = state.resource.map((item) => {
						if (
							item.idSessionExpirationType ===
							idSessionExpirationType
						) {
							return {
								...item,
								clientMessage,
								closingTime,
							}
						}
						return item
					})
				}
			)
	},
})

export const selectConfigExpiracion = (state: AppState) =>
	state.configExpiracion
export const configExpiracionSelector = createSelector(
	selectConfigExpiracion,
	(state) => state
)

export const configExpiracionReducer = Slice.reducer

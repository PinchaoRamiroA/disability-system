import { ReducerType } from '@/types/Reducer'
import { ParametroCaducidad } from '@/types/users'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getParametrosCaducidad, updateParametrosCaducidad } from '../actions'
import { AppState } from '@/store/index'

const initialState: ReducerType<ParametroCaducidad[]> = {
	getStatus: 'idle',
	resource: [],
}

const slice = createSlice({
	name: 'parametros-caducidad',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getParametrosCaducidad.pending, (state) => {
				state.getStatus = 'pending'
			})
			.addCase(
				getParametrosCaducidad.fulfilled,
				(state, action: PayloadAction<ParametroCaducidad[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getParametrosCaducidad.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateParametrosCaducidad.fulfilled,
				(state, action: PayloadAction<ParametroCaducidad>) => {
					const { organization } = action.payload
					state.resource = state.resource.map((item) => {
						if (item.organization === organization) {
							return { ...item, ...action.payload }
						}
						return item
					})
				}
			)
	},
})

export const selectParamsCaducidad = (state: AppState) =>
	state.parametrosCaducidad
export const parametrosCaducidadSelector = createSelector(
	selectParamsCaducidad,
	(state) => state
)

export const parametrosCaducidadReducer = slice.reducer

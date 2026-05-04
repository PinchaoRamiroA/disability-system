import { ReducerType } from '@/types/Reducer'
import { ParametroBloqueo } from '@/types/users'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getParametrosBloqueo, updateParametrosBloqueo } from '../actions'
import { AppState } from '@/store/index'

const initialState: ReducerType<ParametroBloqueo[]> = {
	getStatus: 'idle',
	resource: [],
}

const slice = createSlice({
	name: 'parametros-bloqueo',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getParametrosBloqueo.pending, (state) => {
				state.getStatus = 'pending'
			})
			.addCase(
				getParametrosBloqueo.fulfilled,
				(state, action: PayloadAction<ParametroBloqueo[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getParametrosBloqueo.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateParametrosBloqueo.fulfilled,
				(state, action: PayloadAction<ParametroBloqueo>) => {
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

export const selectParamsBloqueo = (state: AppState) => state.parametrosBloqueo
export const parametrosBloqueoSelector = createSelector(
	selectParamsBloqueo,
	(state) => state
)

export const parametrosBloqueoReducer = slice.reducer

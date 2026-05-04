import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import {
	createCausalNegocio,
	deleteCausalNegocio,
	getCausalesNegocio,
	updateCausalNegocio,
} from '../actions'
import { Causal } from '@/types/Causales'
import moment from 'moment'

const initialState: ReducerType<Causal[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'causales-negocio',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCausalesNegocio.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getCausalesNegocio.fulfilled,
				(state, action: PayloadAction<Causal[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => ({
						...item,
						id: item.idCausal,
						fechaCreacion: moment(item.fechaCreacion).format(
							'DD/MM/YYYY HH:mm:ss'
						),
						fechaActualizacion: moment(
							item.fechaActualizacion
						).isValid()
							? moment(item.fechaActualizacion).format(
									'DD/MM/YYYY HH:mm:ss'
							  )
							: item.fechaActualizacion,
					}))
				}
			)
			.addCase(getCausalesNegocio.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createCausalNegocio.fulfilled,
				(state, action: PayloadAction<Causal>) => {
					const newCausal = {
						...action.payload,
						fechaCreacion: moment(
							action.payload.fechaCreacion
						).format('DD/MM/YYYY HH:mm:ss'),
					}

					state.getStatus = 'resolved'
					state.resource = [...state.resource, newCausal].sort(
						(a, b) => a.nombre.localeCompare(b.nombre)
					)
				}
			)
			.addCase(
				updateCausalNegocio.fulfilled,
				(state, action: PayloadAction<Causal>) => {
					state.resource = state.resource
						.map((item) =>
							item.idCausal === action.payload.idCausal
								? {
										...item,
										activo: action.payload.activo,
										nombre: action.payload.nombre,
										descripcion: action.payload.descripcion,
										fechaActualizacion: moment(
											action.payload.fechaActualizacion
										).format('DD/MM/YYYY HH:mm:ss'),
								  }
								: item
						)
						.sort((a, b) => a.nombre.localeCompare(b.nombre))
				}
			)
			.addCase(
				deleteCausalNegocio.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.resource = state.resource.filter(
						(item) => item.idCausal !== action.payload
					)
				}
			)
	},
})

export const selectCausalesNegocio = (state: AppState) => state.causalesNegocio
export const causalesNegocioSelector = createSelector(
	selectCausalesNegocio,
	(state) => state
)

export const causalesNegocioReducer = Slice.reducer

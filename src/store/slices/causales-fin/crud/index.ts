import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import {
	createCausalFin,
	deleteCausalFin,
	getCausalesFin,
	updateCausalFin,
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
			.addCase(getCausalesFin.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getCausalesFin.fulfilled,
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
			.addCase(getCausalesFin.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createCausalFin.fulfilled,
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
				updateCausalFin.fulfilled,
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
				deleteCausalFin.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.resource = state.resource.filter(
						(item) => item.idCausal !== action.payload
					)
				}
			)
	},
})

export const selectCausalesFin = (state: AppState) => state.causalesFin
export const causalesFinSelector = createSelector(
	selectCausalesFin,
	(state) => state
)

export const causalesFinReducer = Slice.reducer

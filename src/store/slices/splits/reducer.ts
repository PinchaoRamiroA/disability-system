import { ReducerType } from '@/types/Reducer'
import {
	createSelector,
	createSlice,
	nanoid,
	PayloadAction,
} from '@reduxjs/toolkit'
import { AppState } from '../..'
import {
	createSplit,
	createSplitDerive,
	createSplitSchedule,
	deleteSplit,
	deleteSplitDerive,
	deleteSplitSchedule,
	getSplits,
	updateSplit,
	updateSplitDerive,
	updateSplitSchedule,
} from './actions'
import {
	DeleteSplitDerive,
	DeleteSplitSchedule,
	Derivacion,
	HorarioSplit,
	Splits,
	UpdateSplitDerive,
	UpdateSplitSchedule,
} from '@/types/Splits'
import { getAvailableTransferSplits } from '../web-chat-human-agent'
import moment from 'moment'

const initialState: ReducerType<Splits[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'splits',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getSplits.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getSplits.fulfilled,
				(state, action: PayloadAction<Splits[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => ({
						...item,
						id: nanoid(),
						fechaCreacion: moment(item.fechaCreacion).format(
							'DD/MM/YYYY HH:mm:ss'
						),
						fechaActualizacion: item.fechaActualizacion
							? moment(item.fechaActualizacion).format(
									'DD/MM/YYYY HH:mm:ss'
							  )
							: '',
					}))
				}
			)
			.addCase(getSplits.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(getAvailableTransferSplits.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getAvailableTransferSplits.fulfilled,
				(state, action: PayloadAction<Splits[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.map((item) => ({
						...item,
						id: nanoid(),
					}))
				}
			)
			.addCase(getAvailableTransferSplits.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				createSplit.fulfilled,
				(state, action: PayloadAction<Splits>) => {
					const data = action.payload
					data.id = nanoid()
					data.derivaciones = []
					data.horariosAtencion = []
					data.fechaCreacion = moment(
						action.payload.fechaCreacion
					).format('DD/MM/YYYY HH:mm:ss')

					state.getStatus = 'resolved'
					state.resource = [data].concat(state.resource)
				}
			)
			.addCase(
				updateSplit.fulfilled,
				(state, action: PayloadAction<Splits>) => {
					const {
						activo,
						descripcion,
						fechaActualizacion,
						idSplit,
						nombre,
						timeInactivityAgent,
						timeInactivityClient,
						timeMaxInitConversation,
					} = action.payload
					state.resource = state.resource.map((item) => {
						if (item.idSplit === idSplit) {
							return {
								...item,
								activo,
								descripcion,
								fechaActualizacion: moment(
									fechaActualizacion
								).format('DD/MM/YYYY HH:mm:ss'),
								nombre,
								timeInactivityAgent,
								timeInactivityClient,
								timeMaxInitConversation,
							}
						}
						return item
					})
				}
			)
			.addCase(
				deleteSplit.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.resource = state.resource.filter(
						(item) => item.idSplit !== action.payload
					)
				}
			)
			.addCase(
				createSplitSchedule.fulfilled,
				(state, action: PayloadAction<HorarioSplit>) => {
					state.getStatus = 'resolved'
					state.resource = state.resource.map((split) => {
						if (split.idSplit === action.payload.id_split) {
							// El campo 'id' se sobreescribe al abrir el componente de calendario, pero, se setea aquí para no generar un typo
							return {
								...split,
								horariosAtencion: split.horariosAtencion.concat(
									{ ...action.payload, id: nanoid() }
								),
							}
						}
						return split
					})
				}
			)
			.addCase(
				updateSplitSchedule.fulfilled,
				(state, action: PayloadAction<UpdateSplitSchedule>) => {
					const { horarios, idSplit } = action.payload

					state.getStatus = 'resolved'
					state.resource = state.resource.map((split) => {
						if (split.idSplit === idSplit) {
							return {
								...split,
								horariosAtencion: horarios,
							}
						}
						return split
					})
				}
			)
			.addCase(
				deleteSplitSchedule.fulfilled,
				(state, action: PayloadAction<DeleteSplitSchedule>) => {
					const { codigoRegistro, idSplit } = action.payload

					state.getStatus = 'resolved'
					state.resource = state.resource.map((split) => {
						if (split.idSplit === idSplit) {
							return {
								...split,
								horariosAtencion: split.horariosAtencion.filter(
									(item) =>
										item.id_hours_by_splits !==
										codigoRegistro
								),
							}
						}
						return split
					})
				}
			)
			.addCase(
				createSplitDerive.fulfilled,
				(state, action: PayloadAction<Derivacion>) => {
					state.getStatus = 'resolved'
					state.resource = state.resource.map((split) => {
						if (split.idSplit === action.payload.split_origin) {
							// El campo 'id' se sobreescribe al abrir el componente de calendario, pero, se setea aquí para no generar un typo
							return {
								...split,
								derivaciones: split.derivaciones.concat(
									action.payload
								),
							}
						}
						return split
					})
				}
			)
			.addCase(
				updateSplitDerive.fulfilled,
				(state, action: PayloadAction<UpdateSplitDerive>) => {
					const { derivaciones, idSplit } = action.payload
					state.getStatus = 'resolved'
					state.resource = state.resource.map((split) => {
						if (split.idSplit === idSplit) {
							return {
								...split,
								derivaciones,
							}
						}
						return split
					})
				}
			)
			.addCase(
				deleteSplitDerive.fulfilled,
				(state, action: PayloadAction<DeleteSplitDerive>) => {
					const { codigoRegistro, idSplit } = action.payload

					state.getStatus = 'resolved'
					state.resource = state.resource.map((split) => {
						if (split.idSplit === idSplit) {
							return {
								...split,
								derivaciones: split.derivaciones.filter(
									(item) =>
										item.id_splits_derive !== codigoRegistro
								),
							}
						}
						return split
					})
				}
			)
	},
})

export const selectSplits = (state: AppState) => state.splits
export const splitsSelector = createSelector(selectSplits, (state) => state)

export const splitsReducer = Slice.reducer

import { AppState } from '@/store/index'
import { AttentionIndicator, IndiAttentionTypes } from '@/types/Indicators'
import { ReducerType } from '@/types/Reducer'
import {
	createSelector,
	createSlice,
	isAnyOf,
	isPending,
	isRejected,
	PayloadAction,
} from '@reduxjs/toolkit'
import {
	getAttendedChats,
	getFCR,
	getNotAttendedChats,
	getTMAsignacion,
	getTMAtencionAH,
	getTMAtencionAV,
	getTMO,
	getFaltaRespuestaBot,
	getNivelAbandono,
} from './actions'

const resource: ReducerType<AttentionIndicator>[] = [
	{
		getStatus: 'idle',
		resource: {
			id: 'TMO',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'FCR',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'TMAsignacion',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'TMAtencionAH',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'TMAtencionAV',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'AttendedChats',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'NotAttendedChats',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'NivelRespuestaBOT',
			value: '--',
		},
	},
	{
		getStatus: 'idle',
		resource: {
			id: 'NivelAbandono',
			value: '--',
		},
	},
]
const initialState: IndiAttentionTypes = {
	resource,
}

export const indicatorSlice = createSlice({
	name: 'attentionIndicators',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				isAnyOf(
					getFCR.fulfilled,
					getTMAsignacion.fulfilled,
					getTMAtencionAH.fulfilled,
					getTMAtencionAV.fulfilled,
					getTMO.fulfilled,
					getAttendedChats.fulfilled,
					getNotAttendedChats.fulfilled,
					getFaltaRespuestaBot.fulfilled,
					getNivelAbandono.fulfilled
				),
				(state, action: PayloadAction<AttentionIndicator>) => {
					state.resource = state.resource.map((item) => {
						if (item.resource.id === action.payload.id) {
							return {
								...item,
								getStatus: 'resolved',
								resource: action.payload,
							}
						}
						return item
					})
				}
			)
			.addMatcher(
				isPending(
					getFCR,
					getTMAsignacion,
					getTMAtencionAH,
					getTMAtencionAV,
					getTMO,
					getAttendedChats,
					getNotAttendedChats,
					getFaltaRespuestaBot,
					getNivelAbandono
				),
				(state, action) => {
					state.resource = state.resource.map((item) => {
						if (item.resource.id === action.meta.requestId) {
							return {
								...item,
								getStatus: 'pending',
								resource: { ...item.resource, value: '--' },
							}
						}
						return item
					})
				}
			)
			.addMatcher(
				isRejected(
					getFCR,
					getTMAsignacion,
					getTMAtencionAH,
					getTMAtencionAV,
					getTMO,
					getAttendedChats,
					getNotAttendedChats,
					getFaltaRespuestaBot,
					getNivelAbandono
				),
				(state, action) => {
					state.resource = state.resource.map((item) => {
						if (item.resource.id === action.meta.requestId) {
							return {
								...item,
								getStatus: 'rejected',
								resource: { ...item.resource, value: '--' },
							}
						}
						return item
					})
				}
			)
	},
})

export const selectAttentionIndicator = (state: AppState) =>
	state.attentionIndicators
export const attentionIndicatorSelector = createSelector(
	selectAttentionIndicator,
	(state) => state
)

export const attentionIndicatorsReducer = indicatorSlice.reducer

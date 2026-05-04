import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../../..'
import { getReporteCausales } from './actions'
import { ReporteCausalesData, ReporteCausalesDataRaw } from '@/types/Causales'
import moment from 'moment'

const initialState: ReducerType<ReporteCausalesData> = {
	getStatus: 'idle',
	resource: {
		currentPage: 0,
		currentResults: 0,
		humanAgentTyping: [],
		totalPages: 0,
		totalResult: 0,
	},
}

const Slice = createSlice({
	name: 'causales-reporte',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getReporteCausales.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getReporteCausales.fulfilled,
				(state, action: PayloadAction<ReporteCausalesDataRaw>) => {
					const { humanAgentTyping } = action.payload
					state.getStatus = 'resolved'
					state.resource = {
						...action.payload,
						humanAgentTyping: humanAgentTyping.map(
							(item, index) => ({
								...item,
								id: index + 1,
								businessCausal:
									item.businessCausal.join('; \n'),
								dateConection: moment(
									item.dateConection.replace('[UTC]', '')
								).format('DD/MM/YYYY'),
								conversationURL: `/analitica/reportes/asesor-virtual/historial/${item.idConv}`,
							})
						),
					}
				}
			)
			.addCase(getReporteCausales.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const selectReporteCausales = (state: AppState) => state.reporteCausales
export const reporteCausalesSelector = createSelector(
	selectReporteCausales,
	(state) => state
)

export const reporteCausalesReducer = Slice.reducer

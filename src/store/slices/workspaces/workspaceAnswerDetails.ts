import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import {
	createWorkspaceAnswer,
	deleteWorkspaceAnswer,
	getWorkspaceAnswerDetail,
	updateWorkspaceAnswer,
} from './actions'
import {
	DeleteWorkspaceAnswerPayload,
	UpdateWorkspaceAnswerPayload,
	WorkspaceAnswerDetail,
} from '@/types/Workspaces'

const initialState: ReducerType<WorkspaceAnswerDetail[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'workspace-answer-details',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getWorkspaceAnswerDetail.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getWorkspaceAnswerDetail.fulfilled,
				(state, action: PayloadAction<WorkspaceAnswerDetail[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload.sort((a, b) =>
						a.elementOrderPos > b.elementOrderPos ? 1 : -1
					)
				}
			)
			.addCase(getWorkspaceAnswerDetail.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateWorkspaceAnswer.fulfilled,
				(
					state,
					action: PayloadAction<UpdateWorkspaceAnswerPayload[]>
				) => {
					const {
						elementTypesIdType,
						elementOrderPos,
						elementValue,
					} = action.payload[0]
					state.getStatus = 'resolved'
					state.resource = state.resource.map((res) => {
						if (res.elementOrderPos === elementOrderPos) {
							return {
								...res,
								elementTypesIdType,
								elementValue,
							}
						}
						return res
					})
				}
			)
			.addCase(
				createWorkspaceAnswer.fulfilled,
				(
					state,
					action: PayloadAction<UpdateWorkspaceAnswerPayload[]>
				) => {
					state.getStatus = 'resolved'
					state.resource = state.resource.concat({
						...action.payload[0],
					})
				}
			)
			.addCase(
				deleteWorkspaceAnswer.fulfilled,
				(
					state,
					action: PayloadAction<DeleteWorkspaceAnswerPayload>
				) => {
					const { elementOrderPos } = action.payload
					state.getStatus = 'resolved'
					state.resource = state.resource.filter(
						(res) => res.elementOrderPos !== elementOrderPos
					)
				}
			)
	},
})

export const workspaceAnswerDetail = (state: AppState) =>
	state.workspaceAnswerDetails
export const workspaceAnswerDetailSelector = createSelector(
	workspaceAnswerDetail,
	(state) => state
)

export const workspaceAnswerDetailsReducer = Slice.reducer

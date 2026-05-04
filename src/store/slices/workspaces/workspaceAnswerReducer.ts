import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getWorkspaceAnswers } from './actions'
import { WorkspaceAnswer } from '@/types/Workspaces'

const initialState: ReducerType<WorkspaceAnswer[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'workspace-answers',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getWorkspaceAnswers.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getWorkspaceAnswers.fulfilled,
				(state, action: PayloadAction<WorkspaceAnswer[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getWorkspaceAnswers.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const workspaceAnswer = (state: AppState) => state.workspaceAnswer
export const workspaceAnswerSelector = createSelector(
	workspaceAnswer,
	(state) => state
)

export const workspaceAnswerReducer = Slice.reducer

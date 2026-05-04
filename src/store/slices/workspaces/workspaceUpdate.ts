import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { updateWorkspace } from './actions'
import { UpdateWorkspace } from '@/types/Workspaces'

const initialState: ReducerType<UpdateWorkspace> = {
	getStatus: 'idle',
	resource: {
		includeWorkpaceData: false,
		integrationResult: '',
		listNewAnswersConfigElement: [],
		listNewAnswersConfigElementFromMaster: [],
		listNewResponseNodes: [],
		listUpdatedResponseNodes: [],
		workpaceData: '',
		workspaceUpdateResponse: '',
	},
}

const Slice = createSlice({
	name: 'workspace-update',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(updateWorkspace.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				updateWorkspace.fulfilled,
				(state, action: PayloadAction<UpdateWorkspace>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(updateWorkspace.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const workspaceUpdateResume = (state: AppState) =>
	state.workspaceUpdateResume
export const workspaceUpdateResumeSelector = createSelector(
	workspaceUpdateResume,
	(state) => state
)

export const workspaceUpdateResumeReducer = Slice.reducer

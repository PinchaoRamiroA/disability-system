import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../..'
import { getWorkspaces } from './actions'
import { Workspace } from '@/types/Workspaces'

const initialState: ReducerType<Workspace[]> = {
	getStatus: 'idle',
	resource: [],
}

const Slice = createSlice({
	name: 'workspaces',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getWorkspaces.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getWorkspaces.fulfilled,
				(state, action: PayloadAction<Workspace[]>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getWorkspaces.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
	},
})

export const workspaces = (state: AppState) => state.workspaces
export const workspacesSelector = createSelector(workspaces, (state) => state)

export const workspacesReducer = Slice.reducer

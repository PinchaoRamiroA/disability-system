import { ReducerType } from '@/types/Reducer'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../..'
import { getWidgetAvatar, updateWidgetAvatar } from '../actions'
import { AvatarType } from '@/types/Settings/General/Widget'

const initialState: ReducerType<AvatarType> = {
	getStatus: 'idle',
	resource: {
		file: null,
		url: '',
	},
}

const Slice = createSlice({
	name: 'widgetAvatar',
	initialState,
	reducers: {
		updateAvatarFile: (state, action: PayloadAction<File>) => {
			return {
				...state,
				resource: {
					...state.resource,
					file: action.payload,
				},
			}
		},
		removeAvatarFile: (state) => {
			return {
				...state,
				resource: {
					...state.resource,
					file: null,
				},
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getWidgetAvatar.pending, (state) => {
				state.getStatus = 'pending'
				state.resource = initialState.resource
			})
			.addCase(
				getWidgetAvatar.fulfilled,
				(state, action: PayloadAction<AvatarType>) => {
					state.getStatus = 'resolved'
					state.resource = action.payload
				}
			)
			.addCase(getWidgetAvatar.rejected, (state) => {
				state.getStatus = 'rejected'
				state.resource = initialState.resource
			})
			.addCase(
				updateWidgetAvatar.fulfilled,
				(state, action: PayloadAction<AvatarType>) => {
					state.resource = action.payload
				}
			)
	},
})

export const { removeAvatarFile, updateAvatarFile } = Slice.actions

export const selectWidgetAvatar = (state: AppState) => state.widgetAvatar
export const widgetAvatarSelector = createSelector(
	selectWidgetAvatar,
	(state) => state
)

export const widgetAvatarReducer = Slice.reducer

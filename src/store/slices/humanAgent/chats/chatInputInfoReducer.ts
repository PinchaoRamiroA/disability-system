import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from '@/store/index'
import { FileInfo, InputInfo } from '@/types/file'

const initialState: InputInfo[] = []

const inputInfoSlice = createSlice({
	name: 'chats',
	initialState,
	reducers: {
		newInputInfo: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			const exists = state.some(
				(item) => item.conversationId === conversationId
			)

			if (!exists) {
				state.push({
					conversationId,
					lastInteraction: '',
					previewFile: null,
				})
			}
		},
		updateInputInfo: (
			state,
			action: PayloadAction<{
				conversationId: number
				lastInteraction: string
			}>
		) => {
			const { conversationId, lastInteraction } = action.payload
			state.forEach((item) => {
				if (item.conversationId === conversationId) {
					item.lastInteraction = lastInteraction
				}
			})
		},
		updateFileInfo: (
			state,
			action: PayloadAction<{
				fileInfo: FileInfo | null
				conversationId: number
			}>
		) => {
			const { conversationId, fileInfo } = action.payload
			state.forEach((item) => {
				if (item.conversationId === conversationId) {
					item.previewFile = fileInfo
				}
			})
		},
		resetInpuInfo: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			state.forEach((item) => {
				if (item.conversationId === conversationId) {
					item.lastInteraction = ''
				}
			})
		},
		resetFileInfo: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			state.forEach((item) => {
				if (item.conversationId === conversationId) {
					const url = item.previewFile?.blobUrl
					if (url) {
						URL.revokeObjectURL(url)
					}
					item.previewFile = null
				}
			})
		},
		removeInputInfo: (
			state,
			action: PayloadAction<{ conversationId: number }>
		) => {
			const { conversationId } = action.payload
			return state.filter((item) => {
				if (item.conversationId === conversationId) {
					const url = item.previewFile?.blobUrl
					if (url) {
						URL.revokeObjectURL(url)
					}
				}
				return item.conversationId !== conversationId
			})
		},
	},
})

export const {
	newInputInfo,
	updateInputInfo,
	updateFileInfo,
	resetInpuInfo,
	resetFileInfo,
	removeInputInfo,
} = inputInfoSlice.actions

export const chatInputInfoState = (state: AppState) => state.chatsInputInfo
export const chatInputInfoSelector = createSelector(
	chatInputInfoState,
	(state) => state
)

export const chatsInputInfoReducer = inputInfoSlice.reducer

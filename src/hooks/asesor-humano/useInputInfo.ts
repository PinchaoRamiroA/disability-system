import {
	chatInputInfoSelector,
	updateFileInfo,
	updateInputInfo,
} from '@/store/slices/humanAgent'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { FileInfo } from '@/types/file'

interface UpdateInputPayload {
	conversationId: number
	inputValue: string
}

interface UpdateFilePayload {
	conversationId: number
	fileInfo: FileInfo | null
}

export const useInputInfo = () => {
	const dispatch = useAppDispatch()
	const inputInfo = useAppSelector(chatInputInfoSelector)

	const getInputInfo = (conversationId: number) => {
		return inputInfo.find((item) => item.conversationId === conversationId)
	}

	const updateInputInfoPivot = ({
		conversationId,
		inputValue,
	}: UpdateInputPayload) => {
		dispatch(
			updateInputInfo({
				conversationId,
				lastInteraction: inputValue,
			})
		)
	}

	const updateFileInfoPivot = ({
		conversationId,
		fileInfo,
	}: UpdateFilePayload) => {
		dispatch(
			updateFileInfo({
				conversationId,
				fileInfo,
			})
		)
	}

	return {
		getInputInfo,
		updateInputInfo: updateInputInfoPivot,
		updateFileInfo: updateFileInfoPivot,
	}
}

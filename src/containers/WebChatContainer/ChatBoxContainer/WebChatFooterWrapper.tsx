import React, { useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useResizeDetector } from 'react-resize-detector'
import { WebChatFooter } from '@/components/WebChat/WebChatFooter/WebChatFooter'
import { StartChatButton } from '@/components/WebChat/WebChatFooter/StartChatButton'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { humanAgentDirectorySelector } from '@/store/slices/humanAgent'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { useInputInfo } from '@/hooks/asesor-humano/useInputInfo'

interface Props {
	setHeight: (value: number | undefined) => void
}

export const WebChatFooterWrapper = ({ setHeight }: Props) => {
	const { ref, height } = useResizeDetector()
	const {
		chatHeaderFooterBg,
		currentChat,
		conversationId,
		prevConversationId,
		inputValue,
		setInputValue,
	} = useChatContext()

	const { getInputInfo, updateInputInfo } = useInputInfo()
	const directoryContact = useAppSelector(humanAgentDirectorySelector)

	const [showFilePreview, setShowFilePreview] = useState(false)

	useEffect(() => {
		setHeight(height)
	}, [height])

	/**
	 * useEffect encargado del cambio de chat
	 * Actualiza la información del chat anterior y recupera la información del chat seleccionado
	 */
	useEffect(() => {
		console.log(
			'Cambio de conversación (de',
			prevConversationId,
			'a',
			conversationId,
			')'
		)

		// No hacer nada si una conversación no ha iniciado o ya se finalizó
		const chatFound = getInputInfo(conversationId)
		const prevChatFound = getInputInfo(prevConversationId)

		if (!chatFound || prevConversationId === -1) {
			setInputValue('')
			return
		}

		// Información del chat seleccionado
		const { lastInteraction, previewFile } = chatFound

		// Actualizar información del chat anterior
		if (prevChatFound) {
			updateInputInfo({
				conversationId: prevConversationId,
				inputValue,
			})
		}

		// Recuperar archivo que se previsualiza (en chat actual)
		if (previewFile?.base64) {
			// Abrir filepreview
			setShowFilePreview(true)
		}
		// No hay archivo para guardar en el reducer
		else {
			setShowFilePreview(false)
		}

		// Recuperar valor del texto del chat seleccionado
		setInputValue(lastInteraction)
	}, [conversationId])

	return (
		<Box borderTop={1} borderColor="#EEE" ref={ref}>
			{currentChat?.status === 'ENTRANTE' && !directoryContact.active && (
				<StartChatButton
					loading={
						currentChat?.escalado &&
						currentChat.transferCompleted === 'false'
					}
				/>
			)}

			{(currentChat?.status === 'ACTIVO' || directoryContact.active) && (
				<WebChatFooter
					backgroundColor={chatHeaderFooterBg}
					height={height}
					inputValue={inputValue}
					showFilePreview={showFilePreview}
					setShowFilePreview={setShowFilePreview}
				/>
			)}
		</Box>
	)
}

import React, { useEffect, useRef } from 'react'

import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { Box } from '@mui/material'
import { ChatMessages } from '@/components/ChatMessages'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { humanAgentDirectorySelector } from '@/store/slices/humanAgent'
import { nanoid } from '@reduxjs/toolkit'
import { ContactBAH } from '@/types/Settings/asesor-humano/directorio'

interface Props {
	headerHeight: number
	footerHeight: number
	backgroundColor: string
}

export const WebChatBody = ({
	headerHeight,
	footerHeight,
	backgroundColor,
}: Props) => {
	const { currentChat } = useChatContext()
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const { active, listadoMensajes } = useAppSelector(
		humanAgentDirectorySelector
	) as ContactBAH

	useEffect(() => {
		scrollToEnd()
	}, [currentChat?.messages.toString()])

	const scrollToEnd = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({
				behavior: 'auto', // 'instant' issue: https://github.com/Microsoft/TypeScript/issues/28755
				block: 'end',
			})
		}
	}

	return (
		<Box
			sx={{
				maxHeight: `calc(100vh - ${
					headerHeight + footerHeight + 2
				}px - 64px)`,
				backgroundColor,
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column',
				padding: '1em 2em',
				flex: 1,
			}}
		>
			{(currentChat || active) && (
				<ChatMessages
					messages={
						active
							? listadoMensajes.length
								? [
										{
											itemOptions: [],
											itemType: 1,
											client: false,
											file: listadoMensajes[0].adjunto,
											id: nanoid(),
											message: listadoMensajes[0].mensaje,
											messageTime:
												listadoMensajes[0].fechaMensaje,
										},
								  ]
								: []
							: currentChat?.messages ?? []
					}
					humanAgent
					conversationId={
						currentChat ? currentChat.conversationId : 0
					}
				>
					<div ref={messagesEndRef}></div>
				</ChatMessages>
			)}
		</Box>
	)
}

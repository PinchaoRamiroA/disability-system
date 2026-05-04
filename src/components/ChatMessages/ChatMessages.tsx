import React, { useEffect, useRef } from 'react'
import { FormatedChat } from '@/types/HumanAgent/WebChat'
import { MessageWrapper } from './MessageWraper'
import { Box, Typography } from '@mui/material'
import { FileManager } from './FileManager'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { formatDate } from '@/utils/helpers/formatConversation'
import { OptionList } from './OptionList'

interface Props {
	messages: FormatedChat[]
	humanAgent?: boolean
	conversationId?: number
	children?: React.ReactNode
	idInteraction?: string
}

interface MessageWraperProps {
	conversationId: number | undefined
	humanAgent: boolean | undefined
	idInteraction: string | undefined
	item: FormatedChat
}

const RenderMessageWrapper = ({
	conversationId,
	humanAgent,
	idInteraction,
	item,
}: MessageWraperProps) => {
	return (
		<MessageWrapper
			client={item.client}
			{...(!humanAgent && {
				interactionScrolled:
					item.interactionId?.toString() === idInteraction,
			})}
		>
			<>
				{item.file && (
					<Box textAlign="center">
						<FileManager
							file={item.file}
							conversationId={
								humanAgent ? conversationId : undefined
							}
							messageId={humanAgent ? item.id : undefined}
						/>
					</Box>
				)}

				{item.itemType === 9 ? (
					<OptionList option={item} />
				) : (
					<ReactMarkdown className="message-box" skipHtml>
						{item.message}
					</ReactMarkdown>
				)}

				<Typography variant="body2" textAlign="end" fontSize={12}>
					<small> {formatDate(item.messageTime)} </small>
				</Typography>
			</>
		</MessageWrapper>
	)
}

export const ChatMessages = ({
	conversationId,
	humanAgent,
	messages,
	children,
	idInteraction,
}: Props) => {
	const interactionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (interactionRef.current) {
			interactionRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			})
		}
	}, [idInteraction, messages])

	return (
		<>
			{messages.map((item) => {
				const isInteractionMatch =
					item.interactionId?.toString() === idInteraction

				if (item.message.trim() === '') {
					return null
				}
				return (
					<React.Fragment key={item.id}>
						{humanAgent ? (
							<RenderMessageWrapper
								conversationId={conversationId}
								humanAgent={humanAgent}
								idInteraction={idInteraction}
								item={item}
							/>
						) : (
							<Box
								ref={isInteractionMatch ? interactionRef : null}
								sx={{
									overflow: 'auto',
									display: 'flex',
									flexDirection: 'column',
									padding: '1em 2em',
									flex: 1,
								}}
							>
								<RenderMessageWrapper
									conversationId={conversationId}
									humanAgent={humanAgent}
									idInteraction={idInteraction}
									item={item}
								/>
							</Box>
						)}
						{children}
					</React.Fragment>
				)
			})}
		</>
	)
}

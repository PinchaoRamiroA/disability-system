import React from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import { Paper } from '@mui/material'
import {
	CHAT_STATUS_COLOR,
	CHAT_STATUS_TEXT,
} from '@/utils/constants/chatStatus'

import { ChatCard } from '@/components/WebChat/ConversationsList'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { chatsSelector, updateActiveChat } from '@/store/slices/humanAgent'
import { ClientState } from '@/types/HumanAgent/WebChat'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { DirectoryButton } from '@/components/WebChat/DirectoryButton'
import { uploadFileSelector } from '@/store/slices/uploadFile'

export const ConversationsListContainer = () => {
	const {
		drawerWidth,
		chatListBg,
		chatHeaderHeigth,
		conversationId,
		setConversationId,
		setPrevConversationId,
	} = useChatContext()

	const chats: ClientState[] = useAppSelector(chatsSelector)
	const { uploading } = useAppSelector(uploadFileSelector)

	const dispatch = useAppDispatch()

	/**
	 * Cambiar de conversación, pero, guardar la información ingresada en la caja de texto
	 * También setea el chat como activo en el state
	 */
	const handleChangeConversation = (newConversationId: number) => {
		setPrevConversationId(conversationId)
		setConversationId(newConversationId)
		dispatch(updateActiveChat({ conversationId: newConversationId }))
	}

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
					overflow: 'hidden',
				},
			}}
			variant="permanent"
			anchor="left"
		>
			<Toolbar sx={{ height: chatHeaderHeigth }} />

			<Paper
				sx={{
					backgroundColor: chatListBg,
					borderBottom: 0,
					borderColor: '#EEE',
					...(conversationId === 0 && {
						borderRadius: 0,
						bgcolor: '#F3F3F3',
					}),
				}}
				elevation={0}
			>
				<Toolbar>
					<DirectoryButton />
				</Toolbar>
			</Paper>

			{conversationId !== 0 && <Divider />}
			<List
				sx={{
					overflow: 'auto',
					paddingTop: 0,
					backgroundColor: chatListBg,
					flexGrow: 1,
				}}
			>
				{chats.map((chat) => {
					if (chat.transfering) {
						return null
					}
					return (
						<ListItem
							key={chat.conversationId}
							disablePadding
							onClick={(e) =>
								uploading
									? e.preventDefault()
									: handleChangeConversation(
											chat.conversationId
									  )
							}
						>
							<ChatCard
								active={chat.active}
								channel={chat.channel.toString()}
								lastInteraction={chat.lastInteraction}
								lastMessage={chat.lastMessage}
								newChat={chat.status === 'ENTRANTE'}
								nombreCliente={chat.nombre}
								statusColor={CHAT_STATUS_COLOR[chat.status]}
								tooltipText={CHAT_STATUS_TEXT[chat.status]}
								unreadMessages={chat.unreadMessages}
								directory={chat.fromDirectory}
							/>
						</ListItem>
					)
				})}
			</List>
		</Drawer>
	)
}

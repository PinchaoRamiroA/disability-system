import React from 'react'

import { Box, Grid, Tooltip, Typography } from '@mui/material'
import { StatusBadge } from '@/components/StatusBadge'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { formatDate } from '@/utils/helpers/formatConversation'
import { ChannelIcon } from '@/components/ChannelIcon'

interface Props {
	active: boolean
	channel: string
	lastInteraction: string
	lastMessage: string
	newChat: boolean
	nombreCliente: string
	statusColor: string
	tooltipText: string
	unreadMessages: number
	directory?: boolean
}

export const ChatCard = ({
	active,
	channel,
	lastInteraction,
	lastMessage,
	newChat,
	nombreCliente,
	statusColor,
	tooltipText,
	unreadMessages,
	directory,
}: Props) => {
	return (
		<Grid
			container
			sx={{
				backgroundColor: active ? '#F3F3F3' : '#FFFFFF',
				'&:hover': {
					backgroundColor: '#F7F7F7',
				},
				cursor: 'pointer',
				userSelect: 'none',
			}}
			py={1.5}
			px={2}
			justifyContent="space-between"
			borderBottom={1}
			borderColor="#E5E5E5"
			spacing={0.5}
		>
			{/* Canal por el que se comunica el cliente */}
			<Grid item xs="auto" mr={1}>
				<StatusBadge color={statusColor} directory={directory}>
					<ChannelIcon channel={channel} title={tooltipText} />
				</StatusBadge>
			</Grid>

			{/* Nombre del cliente, última interacción y hora */}
			<Grid item xs container justifyContent="space-between">
				{/* Nombre del cliente y última interacción */}
				<Grid item sx={{ maxWidth: 180 }}>
					<Tooltip title={nombreCliente}>
						<Typography
							variant="body1"
							sx={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{nombreCliente}
						</Typography>
					</Tooltip>
					<Tooltip title={lastInteraction}>
						<Box>
							<ReactMarkdown className="last-interaction">
								{lastInteraction}
							</ReactMarkdown>
						</Box>
					</Tooltip>
				</Grid>

				{/* Fecha y hora*/}
				<Grid
					item
					display="flex"
					flexDirection="column"
					alignItems="end"
				>
					<Typography
						variant="body2"
						fontSize={12}
						sx={{
							color:
								newChat || unreadMessages > 0 ? '#4EBA30' : '',
						}}
					>
						<small>{formatDate(lastMessage)}</small>
					</Typography>

					{unreadMessages > 0 && (
						<Box
							sx={{
								padding: 1,
								margin: 'auto',
								color: '#fff',
								backgroundColor: '#4EBA30',
								borderRadius: '50%',
								height: 10,
								width: 10,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: 12,
							}}
						>
							{unreadMessages}
						</Box>
					)}
				</Grid>
			</Grid>
		</Grid>
	)
}

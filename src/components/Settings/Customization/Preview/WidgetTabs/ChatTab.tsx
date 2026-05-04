import React from 'react'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'
import { AttachFile, Send, SentimentVerySatisfied } from '@mui/icons-material'
import { Box, Grid, OutlinedInput, Typography, useTheme } from '@mui/material'
import { LogoTab } from '../DashboardTabs/LogoTab'

export const ChatTab = () => {
	const {
		widgetChat: {
			header,
			messages: { agent, client },
			footer,
		},
	} = useTheme()
	return (
		<Grid container height={`calc(${CONTAINER_HEIGHT_CALC} - 3em)`}>
			<Grid
				item
				container
				xs={12}
				height="17%"
				bgcolor={header.background}
				color={header.color}
				p={2}
				borderBottom={1}
				borderColor="#ddcbcb"
			>
				<Grid item xs="auto">
					<LogoTab widget borderRadius width={50} height={50} />
				</Grid>
				<Grid item xs>
					<Typography align="center" variant="h6">
						Asistente virtual
					</Typography>
					<Typography align="center">Texto descriptivo</Typography>
				</Grid>
			</Grid>
			<Grid
				container
				item
				xs={12}
				height={'67%'}
				p={2}
				gap={2}
				overflow={'auto'}
			>
				<Grid item xs={12}>
					<Box
						bgcolor={agent.background}
						color={agent.color}
						width={300}
						p={2}
						borderRadius="0 16px 16px"
					>
						<Typography>
							Lorem ipsum dolor, sit amet consectetur adipisicing
							elit. Temporibus odit
						</Typography>
						<Typography variant="body2" textAlign="end">
							<small>25/01/2024 11:11:02</small>
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} display="flex" justifyContent="flex-end">
					<Box
						bgcolor={client.background}
						color={client.color}
						width={400}
						p={2}
						borderRadius="16px 0 16px 16px"
					>
						<Typography>
							Lorem ipsum dolor, sit amet consectetur adipisicing
							elit. Temporibus odit
						</Typography>
						<Typography variant="body2" textAlign="end">
							<small>25/01/2024 11:11:02</small>
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} justifyContent={'center'}>
					<Box
						bgcolor={agent.background}
						color={agent.color}
						width={350}
						p={2}
						borderRadius="0 16px 16px"
					>
						<Typography>
							Lorem ipsum dolor, sit amet consectetur adipisicing
							elit. Temporibus odit
						</Typography>
						<Typography variant="body2" textAlign="end">
							<small>25/01/2024 11:11:02</small>
						</Typography>
					</Box>
				</Grid>
			</Grid>
			<Grid
				container
				item
				xs={12}
				bgcolor={footer.background}
				height={'15%'}
				alignItems={'center'}
				px={2}
				gap={2}
				borderTop={1}
				borderColor="#ddcbcb"
			>
				<Grid item xs>
					<OutlinedInput
						multiline
						fullWidth
						placeholder="Escribe tu mensaje"
						size="small"
						sx={{ backgroundColor: 'white' }}
					/>
				</Grid>
				<Grid item xs="auto" color={footer.icons}>
					<SentimentVerySatisfied />
					<AttachFile />
					<Send />
				</Grid>
			</Grid>
		</Grid>
	)
}

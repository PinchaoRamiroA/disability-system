import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { interactionHistorySelector } from '@/store/slices/reports/humanAgent/history'
import {
	formatInteractionFact,
	parsedRequestData,
} from '@/utils/helpers/formatConversation'
import { Box, Grid, Paper } from '@mui/material'
import { FormatedChat } from '@/types/HumanAgent/WebChat'
import { ChatMessages } from '../ChatMessages'
import { HistoryHeader } from './HistoryHeader'
import { useResizeDetector } from 'react-resize-detector'
import { HistoryUserData } from '@/types/reports/humanAgent/History'

interface Props {
	height: string
	integrationsHistory?: boolean
	idInteraction?: string
	userData?: HistoryUserData
}

export const HistoryViewer = ({
	height,
	integrationsHistory = false,
	idInteraction,
	userData: userDataAlias,
}: Props) => {
	const { resource: interactionHistory } = useAppSelector(
		interactionHistorySelector
	)

	const [formattedChat, setFormattedChat] = useState<FormatedChat[]>([])
	const [userData, setUserData] = useState<HistoryUserData | undefined>(
		userDataAlias
	)

	const { ref, height: headerHeight } = useResizeDetector()

	useEffect(() => {
		if (interactionHistory.length) {
			// Obtener datos de la última interacción para mostrar en el header
			const interaction =
				interactionHistory[interactionHistory.length - 1]
			const {
				context: {
					endCustIdType,
					endCustIdNumber,
					endCustMail,
					endCustPhone,
					TypeIdNumberWpp,
					IdNumberWpp,
					EmailWpp,
					PhoneNumberWpp,
				},
				channel,
			} = parsedRequestData(interaction)

			setUserData({
				conversationId: interaction.idConversation.toString(),
				cityName: interaction.cityName,
				departmentName: interaction.departmentName,
				endCustIdNumber: endCustIdNumber
					? endCustIdNumber
					: channel === 3 && IdNumberWpp
					? IdNumberWpp
					: '',
				endCustIdType: endCustIdType
					? endCustIdType
					: channel === 3 && TypeIdNumberWpp
					? TypeIdNumberWpp
					: '',
				endCustMail: endCustMail
					? endCustMail
					: channel === 3 && EmailWpp
					? EmailWpp
					: '',
				endCustPhone: endCustPhone
					? endCustPhone
					: channel === 3 && PhoneNumberWpp
					? PhoneNumberWpp
					: '',
			})
		}

		setFormattedChat(formatInteractionFact(interactionHistory))
	}, [interactionHistory])

	return (
		<Grid item xs={integrationsHistory ? 12 : 8} flex={1}>
			<Paper elevation={integrationsHistory ? 1 : 0}>
				<Box
					ref={ref}
					sx={{ borderLeft: 1, borderColor: '#E5E5E5' }}
					bgcolor={'white'}
				>
					<HistoryHeader userData={userData} />
				</Box>
				<Box
					sx={{
						height: `calc(${height} - ${headerHeight}px)`,
						overflowX: 'hidden',
						bgcolor: '#f0f0f0',
						borderLeft: 1,
						borderColor: '#E5E5E5',
					}}
				>
					<ChatMessages
						messages={formattedChat}
						idInteraction={idInteraction}
					/>
				</Box>
			</Paper>
		</Grid>
	)
}

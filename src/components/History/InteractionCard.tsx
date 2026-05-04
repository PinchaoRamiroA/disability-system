import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {
	AttentionInteractions,
	InteractionBase,
} from '@/types/reports/humanAgent/History'
import { Grid, Tooltip, Typography } from '@mui/material'
import { getLastInteraction } from '@/utils/helpers/formatConversation'
import { ChannelIcon } from '../ChannelIcon'
import { RequestData } from '@/types/HumanAgent/WebChat'

interface Props {
	interaction?: InteractionBase
	interactionAttention?: AttentionInteractions
	listWidthOverflow: number | undefined
	active: boolean
	channel: string
	requestData?: RequestData
}

export const InteractionCard = ({
	interaction,
	interactionAttention,
	listWidthOverflow,
	active,
	channel,
	requestData,
}: Props) => {
	const [dateLabel, setDateLabel] = useState('')
	const [mainLabel, setMainLabel] = useState('')
	const [mainTooltip, setMainTooltip] = useState('')
	const [secondLabel, setSecondLabel] = useState('')
	const [thirdLabel, setThirdLabel] = useState('')
	const [infoLabel, setInfoLabel] = useState('')
	const [eventLabel, setEventLabel] = useState('')

	useEffect(() => {
		// console.log('INTERACTION', interaction, interactionAttention)
		if (interaction) {
			setMainLabel(interaction.intent)
			setMainTooltip('Intención')
			setDateLabel(
				moment(interaction.interactionTime).format('DD/MM/YY, h:mm a')
			)
			setSecondLabel(requestData?.context.endCustName ?? 'N/A')

			const last = getLastInteraction(interaction)
			setInfoLabel(last?.message ?? '')
		} else if (interactionAttention) {
			const { interactionTime } = interactionAttention
			const date = moment(interactionTime).isValid()
				? moment(interactionTime).format('DD/MM/YYYY')
				: moment
						.parseZone(
							interactionTime,
							'ddd MMM DD HH:mm:ss ZZ YYYY'
						)
						.format('DD/MM/YYYY')
			setMainLabel(interactionAttention.splitOrigin)
			setMainTooltip('Split')
			setDateLabel(date)
			setSecondLabel(interactionAttention.endCustName)
			setThirdLabel(interactionAttention.agentName)
			setEventLabel(interactionAttention.event)
		}
	}, [])

	return (
		<Grid
			container
			sx={{
				backgroundColor: active ? '#E0E0E0' : '#FFF',
				'&:hover': {
					backgroundColor: '#F0F0F0',
				},
				cursor: 'pointer',
				userSelect: 'none',
			}}
			justifyContent="space-between"
			alignItems="flex-start"
			px={2}
			py={1}
		>
			{/* Canal */}
			<Grid item xs="auto" mr={1}>
				<ChannelIcon channel={channel} />
			</Grid>
			{/* Splits - Intención, cliente, asesor, fecha  */}
			<Grid item xs container>
				{/* Intención y hora */}
				<Grid item xs={12} container alignItems="flex-start">
					{/* Intención */}
					<Grid item xs>
						<Tooltip title={mainTooltip}>
							<Typography
								variant="body1"
								fontSize={14}
								sx={{
									fontWeight: 500,
									wordWrap: 'break-word',
								}}
							>
								{mainLabel}
							</Typography>
						</Tooltip>
					</Grid>
					{/* Hora de la interacción */}
					<Grid item xs="auto">
						<Typography variant="body2" fontSize={12}>
							<small>{dateLabel}</small>
						</Typography>
					</Grid>
				</Grid>
				{/* Evento de finalización */}
				{eventLabel.length > 0 && (
					<Grid>
						<Grid item xs={12}>
							<Typography variant="body1" fontSize={12}>
								<strong>Evento: </strong>
								{eventLabel}
							</Typography>
						</Grid>
					</Grid>
				)}
				{/* Nombre del cliente */}
				<Grid item xs={12}>
					<Typography variant="body1" fontSize={12}>
						<strong>Cliente: </strong>
						{secondLabel}
					</Typography>
				</Grid>
				{/* Nombre del asesor */}
				<Grid item xs={12}>
					<Typography variant="body1" fontSize={12}>
						<strong>{interactionAttention && 'Asesor: '}</strong>
						{thirdLabel}
					</Typography>
				</Grid>
			</Grid>

			{/* Última interacción */}
			<Grid item xs={12} mt={1}>
				<Tooltip title={infoLabel}>
					<Typography
						variant="body1"
						fontSize={12}
						maxWidth={listWidthOverflow}
						textOverflow={'ellipsis'}
						whiteSpace={'nowrap'}
						overflow={'hidden'}
					>
						{infoLabel}
					</Typography>
				</Tooltip>
			</Grid>
		</Grid>
	)
}

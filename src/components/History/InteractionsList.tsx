import React, { useEffect, useState } from 'react'
import {
	AttentionInteractions,
	HistoryUserData,
	InteractionBase,
} from '@/types/reports/humanAgent/History'
import { Box, Grid, List, ListItem, Paper } from '@mui/material'
import { InteractionCard } from './InteractionCard'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { getInteractionHistory } from '@/store/slices/reports/humanAgent/history'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useResizeDetector } from 'react-resize-detector'
import { useLoading } from '@/hooks/useLoading'
import { useChannelLabel } from '@/hooks/useChannelLabel'
import { parsedRequestData } from '@/utils/helpers/formatConversation'

interface Props {
	interactions: InteractionBase[]
	attentionInteractions: AttentionInteractions[]
	height: string
	setUserData: (user: HistoryUserData) => void
}

export const InteractionsList = ({
	interactions,
	attentionInteractions,
	height,
	setUserData,
}: Props) => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()
	const { ref, width: listWidth } = useResizeDetector()
	const { startLoading, stopLoading } = useLoading()
	const { getChannelLabel } = useChannelLabel()

	const [conversationId, setConversationId] = useState<number | null>(null)

	useEffect(() => {
		if (conversationId) {
			startLoading()
			Promise.all([
				dispatch(getInteractionHistory({ idOrg, conversationId })),
			]).then(() => stopLoading())
		}
	}, [conversationId])

	const handleClick = (_conversationId: number) => {
		if (_conversationId !== conversationId) {
			setConversationId(_conversationId)
		}
	}

	return (
		<Grid item xs={12} overflow={'auto'} height={`calc(${height})`}>
			<Paper sx={{ borderRadius: 0 }}>
				<Box ref={ref}>
					<List sx={{ p: 0 }}>
						{/* Interacciones de historial y trazabilidad */}
						{interactions.map((el) => (
							<ListItem
								key={el.id}
								onClick={() => handleClick(el.idConversation)}
								disablePadding
								sx={{ borderBottom: 1, borderColor: '#e5e5e5' }}
							>
								<InteractionCard
									interaction={el}
									listWidthOverflow={listWidth}
									active={
										el.idConversation === conversationId
									}
									channel={getChannelLabel(el.channelId)}
									requestData={parsedRequestData(el)}
								/>
							</ListItem>
						))}

						{/* Interacciones de chats atendidos y no atendidos */}
						{attentionInteractions.map((el) => (
							<ListItem
								key={el.idConversation}
								onClick={() => {
									handleClick(el.idConversation)
									setUserData({
										cityName: el.city,
										conversationId:
											el.idConversation.toString(),
										departmentName: el.department,
										endCustIdNumber: el.endCustIdNumber,
										endCustIdType: el.endCustIdType,
										endCustMail: el.endCustMail,
										endCustPhone: el.endCustPhone,
									})
								}}
								disablePadding
								sx={{ borderBottom: 1, borderColor: '#e5e5e5' }}
							>
								<InteractionCard
									interactionAttention={el}
									listWidthOverflow={listWidth}
									active={
										el.idConversation === conversationId
									}
									channel={el.channel}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Paper>
		</Grid>
	)
}

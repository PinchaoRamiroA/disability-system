import React, { useEffect, useState } from 'react'
import { FilterContainer } from '@/containers/FilterContainer'

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'

import {
	conversationsSelector,
	interactionsTotalSelector,
	getChatSessionsConversations as getConversations,
	getChatSessionsInteractions as getInteractions,
	getInteractionsAVG,
	interactionsAVGSelector,
} from '@/store/slices/stats/chatSessions'

import { ChartContainer } from './ChartContainer'
import { GridContainer } from '@/components/GridContainer'
import {
	ConversacionesCanalParams,
	Datum,
} from '@/types/Statistics/ChatSessions'
import { Indicator } from '@/components/Indicator'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'

export const ChatSessionsContainer = () => {
	const dispatch = useAppDispatch()
	const { resource: chatSessions, getStatus: chatSessionsStatus } =
		useAppSelector(conversationsSelector)
	const { resource: interactionsTotal, getStatus: interactionsStatus } =
		useAppSelector(interactionsTotalSelector)
	const { getStatus: AVGStatus, resource: interactionsAVG } = useAppSelector(
		interactionsAVGSelector
	)
	const { start, end, regionals } = useAppSelector(filterSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { stopLoading } = useLoading()

	const [sessions, setSessions] = useState(0)
	const [escalatedChats, setEscalatedChats] = useState(0)
	const [firstLevel, setFirstLevel] = useState(0)
	const [chartData, setChartData] = useState<Datum[]>([])

	const setValues = () => {
		const vaCount = chatSessions.summary.filter((e) => e.idChannel === 4)[0]
		let sum = 0

		chatSessions.summary.forEach((ch) => {
			sum += ch.count
		})

		if (vaCount) {
			setEscalatedChats(vaCount.count)
			setFirstLevel(sum - vaCount.count)
		}

		setSessions(sum)
	}

	useEffect(() => {
		stopLoading()
	}, [])

	useEffect(() => {
		if (idOrg && start && end && idVa) {
			const params: ConversacionesCanalParams = {
				idOrg,
				payload: {
					start,
					end,
					idVa,
					idRegionals: regionals,
				},
			}

			dispatch(getConversations(params))
			dispatch(getInteractions(params))
			dispatch(getInteractionsAVG(params))
		}
	}, [idOrg, start, end, idVa, regionals])

	useEffect(() => {
		setValues()
		setChartData(chatSessions.data)
	}, [chatSessions])

	return (
		<React.Fragment>
			<GridContainer>
				<FilterContainer
					filters={{
						regionals: true,
						virtualAgent: true,
					}}
				/>

				<Indicator
					title="Total de sesiones de chat"
					value={sessions}
					loading={
						chatSessionsStatus === 'pending' ||
						chatSessionsStatus === 'rejected'
					}
				/>
				<Indicator
					title="Chats atendidos por asesor virtual"
					value={firstLevel}
					loading={
						chatSessionsStatus === 'pending' ||
						chatSessionsStatus === 'rejected'
					}
				/>
				<Indicator
					title="Chats atendidos por asesor humano"
					value={escalatedChats}
					loading={
						chatSessionsStatus === 'pending' ||
						chatSessionsStatus === 'rejected'
					}
				/>
				<Indicator
					title="Total de interacciones"
					value={interactionsTotal}
					loading={
						interactionsStatus === 'pending' ||
						interactionsStatus === 'rejected'
					}
				/>
				<Indicator
					title="Promedio de mensajes por conversación"
					value={interactionsAVG}
					loading={
						AVGStatus === 'pending' || AVGStatus === 'rejected'
					}
				/>

				<ChartContainer
					data={chartData}
					summary={chatSessions.summary}
					loading={
						chatSessionsStatus === 'pending' ||
						chatSessionsStatus === 'rejected'
					}
				/>
			</GridContainer>
		</React.Fragment>
	)
}

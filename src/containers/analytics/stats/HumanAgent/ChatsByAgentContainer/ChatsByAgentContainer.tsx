import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { ChartContainer } from './ChartContainer'

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'

import { agentsChatsSelector, getAgentsChats } from '@/store/slices/humanAgent'
import { filterSelector } from '@/store/slices/Filter'

import { AgentsChatsDetail } from '@/types/HumanAgent'
import { Indicator } from '@/components/Indicator'
import { useLoading } from '@/hooks/useLoading'

export const ChatsByAgentContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()

	const { resource: chats, getStatus } = useAppSelector(agentsChatsSelector)
	const { start, end, channels, splits } = useAppSelector(filterSelector)
	const { stopLoading } = useLoading()

	const [data, setData] = useState<AgentsChatsDetail[]>([])
	const [total, setTotal] = useState(0)

	/**
	 * Ejecutar servicio
	 */
	useEffect(() => {
		if (start && end && idOrg) {
			dispatch(
				getAgentsChats({
					idOrg,
					filters: { start, end, channels, splits },
				})
			)
		}
	}, [start, end, idOrg, channels, splits])

	/**
	 * Datos de la gráfica
	 */
	useEffect(() => {
		setTotal(chats.count)
		setData(chats.detail ?? [])
	}, [chats])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer justify="flex-start">
				<FilterContainer
					filters={{ dates: true, channels: true, splits: true }}
				/>

				<Indicator
					title="Total chats por asesor"
					value={total}
					loading={
						getStatus === 'pending' || getStatus === 'rejected'
					}
				/>

				<ChartContainer
					data={data}
					loading={
						getStatus === 'pending' || getStatus === 'rejected'
					}
				/>
			</GridContainer>
		</React.Fragment>
	)
}

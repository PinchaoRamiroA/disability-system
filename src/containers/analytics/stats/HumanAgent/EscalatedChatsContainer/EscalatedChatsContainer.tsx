import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { ChartContainer } from './ChartContainer'

import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'

import { filterSelector } from '@/store/slices/Filter'
import {
	escalatedChatsSelector,
	getEscalatedChats,
} from '@/store/slices/humanAgent'

import { EscalatedChatsDetail } from '@/types/HumanAgent'
import { Indicator } from '@/components/Indicator'
import { useLoading } from '@/hooks/useLoading'

export const EscalatedChatsContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()

	const { resource: chats, getStatus } = useAppSelector(
		escalatedChatsSelector
	)
	const { start, end } = useAppSelector(filterSelector)
	const { stopLoading } = useLoading()

	const [data, setData] = useState<EscalatedChatsDetail[]>([])
	const [total, setTotal] = useState(0)

	/**
	 * Ejecutar servicio
	 */
	useEffect(() => {
		if (start && end && idOrg) {
			dispatch(getEscalatedChats({ idOrg, filters: { start, end } }))
		}
	}, [start, end, idOrg])

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
				<FilterContainer filters={{ dates: true }} />

				<Indicator
					title="Total chats escalados"
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

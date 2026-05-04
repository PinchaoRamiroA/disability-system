import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Indicator } from '@/components/Indicator'
import { FilterContainer } from '@/containers/FilterContainer'
import { ChartContainer } from './ChartContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { getChats, overallChatsSelector } from '@/store/slices/humanAgent'
import { filterSelector } from '@/store/slices/Filter'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { OverallChatsDetails } from '@/types/HumanAgent/Chats'
import { useLoading } from '@/hooks/useLoading'

export const ChatsContainer = () => {
	const dispatch = useAppDispatch()

	const { getStatus, resource } = useAppSelector(overallChatsSelector)
	const { start, end, splits, regionals, departments } =
		useAppSelector(filterSelector)
	const { idOrg } = useCompanyAndIdVa()
	const { stopLoading } = useLoading()

	// Totales
	const [totalChats, setTotalChats] = useState(0)
	const [totalAttended, setTotalAttended] = useState(0)
	const [totalNotAttended, setTotalNotAttended] = useState(0)

	// Data
	const [data, setData] = useState<OverallChatsDetails[]>([])

	// Llamar servicio
	useEffect(() => {
		if (start && end && idOrg) {
			dispatch(
				getChats({
					idOrg,
					params: {
						end,
						idRegionals: regionals,
						splits,
						start,
					},
				})
			)
		}
	}, [start, end, idOrg, splits, regionals, departments])

	// Manipular respuesta del servicio
	useEffect(() => {
		if (resource.summary.length) {
			const { totalAtendidos, totalChats, totalNoAtendidos } =
				resource.summary[0].rating

			setTotalChats(totalChats)
			setTotalAttended(totalAtendidos)
			setTotalNotAttended(totalNoAtendidos)
		}
		setData(resource.data)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer justify="flex-start">
				<FilterContainer
					filters={{
						splits: true,
						regionals: true,
					}}
				/>

				<Indicator
					title="Número de chats"
					value={totalChats}
					loading={
						getStatus === 'pending' || getStatus === 'rejected'
					}
				/>

				<ChartContainer
					data={data}
					totalAttended={totalAttended}
					totalNotAttended={totalNotAttended}
					dataLength={totalChats}
					loading={
						getStatus === 'pending' || getStatus === 'rejected'
					}
				/>
			</GridContainer>
		</React.Fragment>
	)
}

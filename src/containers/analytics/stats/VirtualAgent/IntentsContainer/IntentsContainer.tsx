import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { getIntents, intentsSelector } from '@/store/slices/intents'
import { IntentsDetail, IntentsSliceParams } from '@/types/Intents'
import React, { useEffect, useState } from 'react'
import { ChartContainer } from './ChartContainer'
import { Indicator } from '@/components/Indicator'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'

export const IntentsContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg, idVa } = useCompanyAndIdVa()

	const { resource: intents, getStatus } = useAppSelector(intentsSelector)
	const { start, end, channels, regionals } = useAppSelector(filterSelector)
	const { stopLoading } = useLoading()

	const [chartData, setChartData] = useState<IntentsDetail[]>([])
	const [total, setTotal] = useState(0)

	useEffect(() => {
		if (idOrg && start && end && idVa) {
			const params: IntentsSliceParams = {
				idOrg,
				filters: {
					start,
					end,
					idVa,
					channels,
					idRegionals: regionals,
				},
			}
			dispatch(getIntents(params))
		}
	}, [idOrg, start, end, idVa, channels, regionals])

	useEffect(() => {
		setTotal(intents.count)
		setChartData(intents.detail ?? [])
	}, [intents])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer justify="flex-start">
				<FilterContainer
					filters={{
						channels: true,
						regionals: true,
						virtualAgent: true,
					}}
				/>

				<Indicator
					title="Total intenciones"
					value={total}
					loading={
						getStatus === 'pending' || getStatus === 'rejected'
					}
				/>

				<ChartContainer
					data={chartData}
					loading={
						getStatus === 'pending' || getStatus === 'rejected'
					}
				/>
			</GridContainer>
		</React.Fragment>
	)
}

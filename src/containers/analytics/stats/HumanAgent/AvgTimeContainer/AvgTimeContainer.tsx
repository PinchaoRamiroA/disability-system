import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { ChartContainer } from './ChartContainer'

import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'

import { avgTimeSelector, getAvgTime } from '@/store/slices/humanAgent'
import { filterSelector } from '@/store/slices/Filter'

import { AvgTimeDetail } from '@/types/HumanAgent'
import { Indicator } from '@/components/Indicator'
import { secondsToTime } from '@/utils/helpers/date'
import { useLoading } from '@/hooks/useLoading'

export const AvgTimeContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()

	const { resource: avgTime, getStatus } = useAppSelector(avgTimeSelector)
	const { start, end } = useAppSelector(filterSelector)
	const { stopLoading } = useLoading()

	const [data, setData] = useState<AvgTimeDetail[]>([])
	const [total, setTotal] = useState<string>('0')

	/**
	 * Ejecutar servicio
	 */
	useEffect(() => {
		if (start && end && idOrg) {
			dispatch(getAvgTime({ idOrg, filters: { start, end } }))
		}
	}, [start, end, idOrg])

	/**
	 * Datos de la gráfica
	 */
	useEffect(() => {
		setTotal(secondsToTime(avgTime.count))
		setData(avgTime.detail ?? [])
	}, [avgTime])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer justify="flex-start">
				<FilterContainer filters={{ dates: true }} />

				<Indicator
					title="Tiempo promedio"
					subtitle="(HH:mm:ss)"
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

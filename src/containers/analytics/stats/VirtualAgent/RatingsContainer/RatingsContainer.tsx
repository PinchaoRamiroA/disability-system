import React, { useEffect } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { Indicator } from '@/components/Indicator'
import { TopRatingChartContainer } from './ChartContainer/TopRatingChartContainer'
import {
	getIntentsTimeRating,
	getIntentsTopRating,
	intentsTimeRatingSelector,
	topRatingsSelector,
} from '@/store/slices/calificaciones'
import { RatingsParams } from '@/types/Statistics/VirtualAgent/Calificaciones'
import { RateIntentsChartContainer } from './ChartContainer/RateIntentsChartContainer'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'

export const RatingsContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { start, end, channels } = useAppSelector(filterSelector)

	const { resource: timeRatingResource, getStatus: timeRatingStatus } =
		useAppSelector(intentsTimeRatingSelector)
	const { resource: topResource, getStatus: topStatus } =
		useAppSelector(topRatingsSelector)
	const { stopLoading } = useLoading()

	useEffect(() => {
		stopLoading()
	}, [])

	// Servicio
	useEffect(() => {
		if (idOrg && start && end && idVa) {
			const params: RatingsParams = {
				idOrg,
				payload: {
					start,
					end,
					idVa,
					channels,
				},
			}
			dispatch(getIntentsTimeRating(params))
			dispatch(getIntentsTopRating(params))
		}
	}, [idOrg, start, end, idVa, channels])

	return (
		<React.Fragment>
			<GridContainer>
				<FilterContainer
					filters={{ channels: true, virtualAgent: true }}
				/>

				<Indicator
					title="Total calificaciones"
					value={topResource.count}
					loading={
						topStatus === 'pending' || topStatus === 'rejected'
					}
				/>

				<Indicator
					title="Calificaciones positivas"
					value={topResource.countSuccess}
					loading={
						topStatus === 'pending' || topStatus === 'rejected'
					}
				/>

				<Indicator
					title="Calificaciones negativas"
					value={topResource.countFailed}
					loading={
						topStatus === 'pending' || topStatus === 'rejected'
					}
				/>
			</GridContainer>

			<GridContainer marginTop={2}>
				<RateIntentsChartContainer
					resource={timeRatingResource}
					status={timeRatingStatus}
				/>
				<TopRatingChartContainer
					resource={topResource}
					status={topStatus}
				/>
			</GridContainer>
		</React.Fragment>
	)
}

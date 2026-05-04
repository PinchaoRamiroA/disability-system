import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import {
	getNotificationEvents,
	getNotifications,
	notificationsEventsSelector,
	notificationsSelector,
} from '@/store/slices/notifications'
import { ChartContainer } from './Charts/ChartContainer'
import { Indicator } from '@/components/Indicator'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'

export const Container = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()
	const { start, end } = useAppSelector(filterSelector)
	const { stopLoading } = useLoading()

	const { resource: notifications, getStatus: notifStatus } = useAppSelector(
		notificationsSelector
	)
	const { resource: events, getStatus: eventsStatus } = useAppSelector(
		notificationsEventsSelector
	)

	const [eventsTotal, setEventsTotal] = useState(0)

	// Obtener Notificaciones y Eventos
	useEffect(() => {
		if (idOrg && start && end) {
			dispatch(
				getNotifications({
					idOrg,
					params: { end, start },
				})
			)
			dispatch(
				getNotificationEvents({
					idOrg,
					params: { end, start },
				})
			)
		}
	}, [start, end, idOrg])

	useEffect(() => {
		setEventsTotal(events.count)
	}, [events])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer justify="flex-start">
				<FilterContainer
					filters={{
						dates: true,
					}}
				/>

				{/* Indicadores */}
				<Indicator
					title="Total de notificaciones y eventos"
					value={eventsTotal}
					loading={
						eventsStatus === 'pending' ||
						eventsStatus === 'rejected'
					}
				/>

				{/* Gráficas */}
				<ChartContainer
					notifications={notifications}
					events={events}
					loadingEvents={
						eventsStatus === 'pending' ||
						eventsStatus === 'rejected'
					}
					loadingNotifications={
						notifStatus === 'pending' || notifStatus === 'rejected'
					}
				/>
			</GridContainer>
		</React.Fragment>
	)
}

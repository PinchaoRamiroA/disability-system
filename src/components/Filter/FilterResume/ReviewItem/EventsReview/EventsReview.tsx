import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const EventsReview = () => {
	const { events } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(events?.length))
	}, [events])

	return showResume ? (
		<ReviewItem data="Eventos" filterName="events" />
	) : (
		<ReviewItem
			title="Eventos:"
			none={true}
			data="ninguno"
			filterName="events"
		/>
	)
}

import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const NotificationTypesReview = () => {
	const { notifChannels } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(notifChannels?.length))
	}, [notifChannels])

	return showResume ? (
		<ReviewItem
			data="Canales notificación"
			filterName="notificationChannels"
		/>
	) : (
		<ReviewItem
			title="Canales notificación:"
			none={true}
			data="ninguno"
			filterName="notificationChannels"
		/>
	)
}

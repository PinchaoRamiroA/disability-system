import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const IntentsReview = () => {
	const { intents } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(intents?.length))
	}, [intents])

	return showResume ? (
		<ReviewItem data="Intenciones" filterName="intents" />
	) : (
		<ReviewItem
			title="Intenciones:"
			none={true}
			data="ninguno"
			filterName="intents"
		/>
	)
}

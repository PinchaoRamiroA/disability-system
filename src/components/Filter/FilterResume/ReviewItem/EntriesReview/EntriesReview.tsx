import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import React, { useEffect, useState } from 'react'
import { ReviewItem } from '../ReviewItem'

export const EntriesReview = () => {
	const { since, until } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(since ?? until))
	}, [since, until])

	return showResume ? (
		<ReviewItem data="Ingresos" filterName="entries" />
	) : (
		<ReviewItem
			title="Ingresos:"
			none={true}
			data="ninguno"
			filterName="entries"
		/>
	)
}

import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const LocationsReview = () => {
	const { regionals } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(regionals?.length))
	}, [regionals])

	return showResume ? (
		<ReviewItem data="Regionales" filterName="locations" />
	) : (
		<ReviewItem
			title="Regionales:"
			none={true}
			data="ninguno"
			filterName="locations"
		/>
	)
}

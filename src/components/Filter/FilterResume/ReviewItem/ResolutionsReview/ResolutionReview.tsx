import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import React, { useEffect, useState } from 'react'
import { ReviewItem } from '../ReviewItem'

export const ResolutionReview = () => {
	const { resolution } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(resolution?.length))
	}, [resolution])

	return showResume ? (
		<ReviewItem data="Resolución" filterName="resolution" />
	) : (
		<ReviewItem
			title="Resolución:"
			none={true}
			data="ninguno"
			filterName="resolution"
		/>
	)
}

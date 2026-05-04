import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const SplitsReview = () => {
	const { splits, singleSplit } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(splits?.length || singleSplit))
	}, [splits, singleSplit])

	return showResume ? (
		<ReviewItem data="Splits" filterName="splits" />
	) : (
		<ReviewItem
			title="Splits:"
			none={true}
			data="ninguno"
			filterName="splits"
		/>
	)
}

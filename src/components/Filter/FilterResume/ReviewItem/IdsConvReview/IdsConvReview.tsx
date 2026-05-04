import React, { useEffect, useState } from 'react'
import { filterSelector } from '@/store/slices/Filter'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { ReviewItem } from '../ReviewItem'

export const IdsConvReview = () => {
	const { idsConv } = useAppSelector(filterSelector)

	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(idsConv?.length))
	}, [idsConv])

	return showResume ? (
		<ReviewItem data="IDs de conversación" filterName="idsConv" />
	) : (
		<ReviewItem
			title="IDs de conversación:"
			none={true}
			data="ninguno"
			filterName="idsConv"
		/>
	)
}

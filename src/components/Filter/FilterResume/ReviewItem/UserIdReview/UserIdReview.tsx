import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import React, { useEffect, useState } from 'react'
import { ReviewItem } from '../ReviewItem'

export const UserIdReview = () => {
	const { id, idType } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		if (id && idType) setShowResume(true)
		else setShowResume(false)
	}, [id, idType])

	return showResume ? (
		<ReviewItem data="Usuario" filterName="user" />
	) : (
		<ReviewItem
			title="Usuario:"
			none={true}
			data="ninguno"
			filterName="user"
		/>
	)
}

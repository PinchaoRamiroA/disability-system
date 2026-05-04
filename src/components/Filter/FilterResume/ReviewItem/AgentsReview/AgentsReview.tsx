import React, { useState, useEffect } from 'react'

import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const AgentsReview = () => {
	const { agents } = useAppSelector(filterSelector)
	const [showResume, setShowResume] = useState(false)

	useEffect(() => {
		setShowResume(Boolean(agents?.length))
	}, [agents])

	return showResume ? (
		<ReviewItem data="Asesores" filterName="agents" />
	) : (
		<ReviewItem
			title="Asesores:"
			none={true}
			data="ninguno"
			filterName="agents"
		/>
	)
}

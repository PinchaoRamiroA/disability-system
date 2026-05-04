import React from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const AttentionReview = () => {
	const { attention } = useAppSelector(filterSelector)

	return attention ? (
		<ReviewItem
			title="Atención:"
			data={
				attention === 'attended'
					? 'Chats atendidos'
					: 'Chats no atendidos'
			}
			filterName="attention"
		/>
	) : null
}

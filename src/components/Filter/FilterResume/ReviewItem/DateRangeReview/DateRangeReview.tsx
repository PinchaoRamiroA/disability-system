import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterDatesSelector, resetDatesFilter } from '@/store/slices/Filter'
import React, { useEffect, useState } from 'react'
import { ReviewItem } from '../ReviewItem'
import { format, toDate } from 'date-fns-tz'
import { es as locale } from 'date-fns/locale'

export const DateRangeReview = () => {
	const dates = useAppSelector(filterDatesSelector)

	const [label, setLabel] = useState('')
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (
			dates.start &&
			typeof dates.start === 'string' &&
			dates.end &&
			typeof dates.end === 'string'
		) {
			const { start, end } = dates
			const formatedStart = format(toDate(start), 'dd MMMM yyyy', {
				locale,
			})

			const formatedEnd = format(toDate(end), 'dd MMMM yyyy', {
				locale,
			})

			setLabel(`${formatedStart} - ${formatedEnd}`)
		}
	}, [dates])

	const handleDelete = () => {
		dispatch(resetDatesFilter())
	}

	return (
		<ReviewItem
			title="Fechas:"
			data={label}
			removeFilter={handleDelete}
			filterName="dates"
		/>
	)
}

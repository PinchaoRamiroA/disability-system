import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterIntegrationServiceNameSelector } from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

export const IntegrationServiceReview = () => {
	const { integrationService } = useAppSelector(
		filterIntegrationServiceNameSelector
	)
	const [show, setShow] = useState(false)

	useEffect(() => {
		setShow(Boolean(integrationService?.length))
	}, [integrationService])

	return show ? (
		<ReviewItem
			data="Servicio integración"
			filterName={'integrationService'}
		/>
	) : (
		<ReviewItem
			title="Servicio integración"
			none={true}
			data="ninguno"
			filterName={'integrationService'}
		/>
	)
}

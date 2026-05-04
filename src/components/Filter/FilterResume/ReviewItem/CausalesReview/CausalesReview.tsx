import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import {
	filterCausalesFinSelector,
	filterCausalesNegocioSelector,
} from '@/store/slices/Filter'
import { ReviewItem } from '../ReviewItem'

interface Props {
	negocio?: boolean
}

export const CausalesReview = ({ negocio = true }: Props) => {
	const { causales } = useAppSelector(
		negocio ? filterCausalesNegocioSelector : filterCausalesFinSelector
	)
	const [show, setShow] = useState(false)

	useEffect(() => {
		setShow(Boolean(causales?.length))
	}, [causales])

	return show ? (
		<ReviewItem
			data={`Causales ${negocio ? 'negocio' : 'finalización'}`}
			filterName={negocio ? 'causalesNegocio' : 'causalesFin'}
		/>
	) : (
		<ReviewItem
			title={`Causales ${negocio ? 'negocio' : 'finalización'} :`}
			none={true}
			data="ninguno"
			filterName={negocio ? 'causalesNegocio' : 'causalesFin'}
		/>
	)
}

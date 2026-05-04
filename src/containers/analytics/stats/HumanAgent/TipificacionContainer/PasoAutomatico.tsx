import { CausalStat } from '@/components/Causales/HumanAgent/CausalStat'
import { EstadisticaCausales } from '@/types/Causales'
import { Status } from '@/types/status'
import React from 'react'

interface Props {
	resource: EstadisticaCausales
	status: Status
}

export const PasoAutomatico = ({ resource, status }: Props) => {
	return (
		<CausalStat
			resource={resource}
			status={status}
			type="paso-automatico"
		/>
	)
}

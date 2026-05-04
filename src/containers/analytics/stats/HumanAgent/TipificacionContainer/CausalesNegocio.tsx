import React from 'react'
import { CausalStat } from '@/components/Causales/HumanAgent/CausalStat'
import { EstadisticaCausales } from '@/types/Causales'
import { Status } from '@/types/status'

interface Props {
	resource: EstadisticaCausales
	status: Status
}

export const CausalesNegocio = ({ resource, status }: Props) => {
	return <CausalStat resource={resource} status={status} type="negocio" />
}

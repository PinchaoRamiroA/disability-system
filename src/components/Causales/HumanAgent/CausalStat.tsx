import React, { useEffect, useState } from 'react'

import { EstadisticaCausales, TipoCausal } from '@/types/Causales'
import { CausalChartWrapper } from './CausalChartWrapper'
import { BarChart } from '@/types/Charts'
import { Status } from '@/types/status'

interface Props {
	type: TipoCausal
	resource: EstadisticaCausales
	status: Status
}

export const CausalStat = ({ type, resource, status }: Props) => {
	const [causales, setCausales] = useState<BarChart[]>([])
	const [keys, setKeys] = useState<string[]>([])

	const filterCausales = () => {
		const temp: BarChart[] = []
		const tempKeys: string[] = []

		// Ordenar datos
		const dataSorted = Object.entries(resource.Causales).sort(
			(a, b) => a[1] - b[1]
		)

		dataSorted.forEach((causal) => {
			temp.push({
				id: causal[0],
				[causal[0]]: causal[1],
			})
			tempKeys.push(causal[0])
		})

		setKeys(tempKeys)
		setCausales(temp)
	}

	useEffect(() => {
		filterCausales()
	}, [resource])

	return (
		<React.Fragment>
			<CausalChartWrapper
				data={causales}
				keys={keys}
				total={resource.Total}
				title={
					type === 'finalizacion'
						? 'Causales de finalización'
						: type === 'negocio'
						? 'Causales de la conversación'
						: 'Causales de paso'
				}
				status={status}
				tooltip={
					type === 'negocio'
						? 'Una conversación puede tener más de una causal asociada'
						: undefined
				}
			/>
		</React.Fragment>
	)
}

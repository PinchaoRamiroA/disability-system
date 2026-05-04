import React, { useEffect, useState } from 'react'

import { AvgTimeDetail } from '@/types/HumanAgent'

import { BarChart } from '@/types/Charts'
import { Chart } from './Chart'
import { RenderChart } from '@/components/Charts/RenderChart'

interface Props {
	data: AvgTimeDetail[]
	loading: boolean
}

export const ChartContainer = ({ data, loading }: Props) => {
	const [chartData, setChartData] = useState<BarChart[]>([])
	const [keys, setKeys] = useState<string[]>([])

	const formatData = () => {
		const temp: BarChart[] = []
		const tempKeys: string[] = []
		// Crear copia de data para poder utilizar el método .sort()
		const tempData: AvgTimeDetail[] = JSON.parse(JSON.stringify(data))

		// Ordenar datos
		tempData.sort(
			(a, b) =>
				a.detail.reduce((prev, curr) => prev + curr.count, 0) -
				b.detail.reduce((prev, curr) => prev + curr.count, 0)
		)

		tempData.forEach((elem) => {
			const value = elem.detail[0].count

			temp.push({
				id: elem.intent,
				[elem.intent]: value,
			})
			tempKeys.push(elem.intent)
		})

		setChartData(temp)
		setKeys(tempKeys)
	}

	useEffect(() => {
		formatData()
	}, [data])

	return (
		<RenderChart
			dataLength={chartData.length}
			chartTitle="Tiempo promedio por asesor"
			loading={loading}
			resizeHeight
		>
			<Chart data={chartData} keys={keys} />
		</RenderChart>
	)
}
